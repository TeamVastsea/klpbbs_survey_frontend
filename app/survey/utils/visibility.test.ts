import { Condition, Question } from '@/model/question';
import { checkVisibility } from './visibility';

describe('checkVisibility', () => {
  // 创建测试用的问题列表
  const createTestQuestions = (): Question[] => [
    // 问题1：无条件，应始终显示
    {
      id: 1,
      page: 1,
      type: 'Text',
      content: { title: '问题1', content: '' },
      values: [],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题2：条件为问题1已回答
    {
      id: 2,
      page: 1,
      type: 'SingleChoice',
      content: { title: '问题2', content: '' },
      values: [
        { title: '选项1', content: '选项1' },
        { title: '选项2', content: '选项2' },
      ],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 1, value: 'answered' }],
        },
      ],
      required: true,
      answer: undefined,
    },
    // 问题3：条件为问题2选择了"选项1"
    {
      id: 3,
      page: 1,
      type: 'MultipleChoice',
      content: { title: '问题3', content: '' },
      values: [
        { title: '选项A', content: '选项A' },
        { title: '选项B', content: '选项B' },
        { title: '选项C', content: '选项C' },
      ],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 2, value: '0' }],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题4：条件为问题3选择了"选项A"或"选项B"
    {
      id: 4,
      page: 1,
      type: 'Text',
      content: { title: '问题4', content: '' },
      values: [],
      condition: [
        {
          type: 'or',
          conditions: [
            { id: 3, value: '0' },
            { id: 3, value: '1' },
          ],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题5：条件为问题1未回答或问题2未选择"选项2"
    {
      id: 5,
      page: 1,
      type: 'Text',
      content: { title: '问题5', content: '' },
      values: [],
      condition: [
        {
          type: 'or',
          conditions: [
            { id: 1, value: 'unanswered' },
            { id: 2, value: '0' },
          ],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题6：复杂条件，(问题1已回答 AND 问题2选择了"选项1") OR (问题3选择了"选项C")
    {
      id: 6,
      page: 1,
      type: 'Text',
      content: { title: '问题6', content: '' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [
            { id: 1, value: 'answered' },
            { id: 2, value: '0' },
          ],
        },
        {
          type: 'or',
          conditions: [{ id: 3, value: '2' }],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题7：NOT条件，问题2未选择"选项1"
    {
      id: 7,
      page: 1,
      type: 'Text',
      content: { title: '问题7', content: '' },
      values: [],
      condition: [
        {
          type: 'not',
          conditions: [{ id: 2, value: '0' }],
        },
      ],
      required: false,
      answer: undefined,
    },
  ];

  it('应该正确处理无条件的问题', () => {
    const questions = createTestQuestions();
    const answers = new Map<number, string>();

    const visibility = checkVisibility(answers, questions);

    // 问题1无条件，应始终显示
    expect(visibility[0]).toBe(true);
  });

  it('应该正确处理已回答/未回答条件', () => {
    const questions = createTestQuestions();
    let answers = new Map<number, string>();

    // 问题1未回答
    let visibility = checkVisibility(answers, questions);
    expect(visibility[1]).toBe(false); // 问题2不应显示，因为问题1未回答
    expect(visibility[4]).toBe(true); // 问题5应显示，因为问题1未回答

    // 问题1已回答
    answers.set(1, '测试回答');
    visibility = checkVisibility(answers, questions);
    expect(visibility[1]).toBe(true); // 问题2应显示，因为问题1已回答
    expect(visibility[4]).toBe(false); // 问题5不应显示，除非问题2选择了"选项1"
  });

  it('应该正确处理单选题条件', () => {
    const questions = createTestQuestions();
    const answers = new Map<number, string>([[1, '测试回答']]);

    // 问题2选择了"选项1"
    answers.set(2, '0');
    let visibility = checkVisibility(answers, questions);
    expect(visibility[2]).toBe(true); // 问题3应显示，因为问题2选择了"选项1"
    expect(visibility[4]).toBe(true); // 问题5应显示，因为问题2选择了"选项1"
    expect(visibility[6]).toBe(false); // 问题7不应显示，因为问题2选择了"选项1"

    // 问题2选择了"选项2"
    answers.set(2, '1');
    visibility = checkVisibility(answers, questions);
    expect(visibility[2]).toBe(false); // 问题3不应显示，因为问题2没有选择"选项1"
    expect(visibility[4]).toBe(false); // 问题5不应显示，因为问题1已回答且问题2没有选择"选项1"
    expect(visibility[6]).toBe(true); // 问题7应显示，因为问题2没有选择"选项1"
  });

  it('应该正确处理多选题条件', () => {
    const questions = createTestQuestions();
    const answers = new Map<number, string>([
      [1, '测试回答'],
      [2, '0'],
    ]);

    // 问题3选择了"选项A"
    answers.set(3, JSON.stringify(['0']));
    let visibility = checkVisibility(answers, questions);
    expect(visibility[3]).toBe(true); // 问题4应显示，因为问题3选择了"选项A"

    // 问题3选择了"选项B"
    answers.set(3, JSON.stringify(['1']));
    visibility = checkVisibility(answers, questions);
    expect(visibility[3]).toBe(true); // 问题4应显示，因为问题3选择了"选项B"

    // 问题3选择了"选项C"
    answers.set(3, JSON.stringify(['2']));
    visibility = checkVisibility(answers, questions);
    expect(visibility[3]).toBe(false); // 问题4不应显示，因为问题3没有选择"选项A"或"选项B"
    expect(visibility[5]).toBe(true); // 问题6应显示，因为问题3选择了"选项C"

    // 问题3选择了多个选项
    answers.set(3, JSON.stringify(['0', '2']));
    visibility = checkVisibility(answers, questions);
    expect(visibility[3]).toBe(true); // 问题4应显示，因为问题3选择了"选项A"
    expect(visibility[5]).toBe(true); // 问题6应显示，因为问题3选择了"选项C"
  });

  it('应该正确处理复杂条件组合', () => {
    const questions = createTestQuestions();
    const answers = new Map<number, string>();

    // 没有回答任何问题
    let visibility = checkVisibility(answers, questions);
    expect(visibility[5]).toBe(false); // 问题6不应显示

    // 问题1已回答，问题2选择了"选项1"
    answers.set(1, '测试回答');
    answers.set(2, '0');
    visibility = checkVisibility(answers, questions);
    expect(visibility[5]).toBe(true); // 问题6应显示

    // 问题1已回答，问题2选择了"选项2"，问题3选择了"选项C"
    answers.set(2, '1');
    answers.set(3, JSON.stringify(['2']));
    visibility = checkVisibility(answers, questions);
    expect(visibility[5]).toBe(true); // 问题6应显示

    // 问题1已回答，问题2选择了"选项2"，问题3选择了"选项A"
    answers.set(3, JSON.stringify(['0']));
    visibility = checkVisibility(answers, questions);
    expect(visibility[5]).toBe(false); // 问题6不应显示
  });

  it('应该正确处理对象形式的answers', () => {
    const questions = createTestQuestions();
    const answers = {
      1: '测试回答',
      2: '0',
    };

    const visibility = checkVisibility(answers, questions);

    expect(visibility[0]).toBe(true); // 问题1应显示
    expect(visibility[1]).toBe(true); // 问题2应显示
    expect(visibility[2]).toBe(true); // 问题3应显示
    expect(visibility[4]).toBe(true); // 问题5应显示
    expect(visibility[6]).toBe(false); // 问题7不应显示
  });
});
