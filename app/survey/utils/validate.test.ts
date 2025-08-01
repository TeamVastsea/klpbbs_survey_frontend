import { Question } from '@/model/question';
import {
  areAllNecessaryQuestionsAnswered,
  checkNecessaryQuestions,
  getVisibleUnansweredQuestions,
} from './validate';

describe('validate', () => {
  // 创建测试用的问题列表
  const createTestQuestions = (): Question[] => [
    // 问题1：必填文本题
    {
      id: 1,
      page: 1,
      type: 'Text',
      content: { title: '姓名', content: '请输入您的姓名' },
      values: [],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题2：必填单选题
    {
      id: 2,
      page: 1,
      type: 'SingleChoice',
      content: { title: '性别', content: '请选择您的性别' },
      values: [
        { title: '男', content: '男' },
        { title: '女', content: '女' },
        { title: '其他', content: '其他' },
      ],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题3：非必填文本题
    {
      id: 3,
      page: 1,
      type: 'Text',
      content: { title: '邮箱', content: '请输入您的邮箱' },
      values: [],
      condition: undefined,
      required: false,
      answer: undefined,
    },
    // 问题4：必填多选题
    {
      id: 4,
      page: 1,
      type: 'MultipleChoice',
      content: { title: '兴趣爱好', content: '请选择您的兴趣爱好' },
      values: [
        { title: '阅读', content: '阅读' },
        { title: '运动', content: '运动' },
        { title: '音乐', content: '音乐' },
      ],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题5：条件问题（如果性别选择了"其他"，则显示）
    {
      id: 5,
      page: 1,
      type: 'Text',
      content: { title: '其他性别说明', content: '请说明您的性别' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 2, value: '2' }],
        },
      ],
      required: true,
      answer: undefined,
    },
    // 问题6：条件问题（如果选择了阅读，则显示）
    {
      id: 6,
      page: 1,
      type: 'Text',
      content: { title: '喜欢的书籍', content: '请分享您喜欢的书籍' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 4, value: '0' }],
        },
      ],
      required: false,
      answer: undefined,
    },
  ];

  describe('checkNecessaryQuestions', () => {
    it('应该返回空的未回答问题列表，当所有必填题都已回答', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([]);
    });

    it('应该返回未回答的必填题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([{ id: 2, title: '性别', reason: 'required' }]);
    });

    it('应该忽略不可见的必填题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'], // 选择了"男"，不触发问题5的显示条件
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([]);
    });

    it('应该包含可见的条件必填题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '2'], // 选择了"其他"，触发问题5的显示条件
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([{ id: 5, title: '其他性别说明', reason: 'required' }]);
    });

    it('应该忽略非必填题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([]);
    });

    it('应该正确处理对象形式的answers', () => {
      const questions = createTestQuestions();
      const answers = {
        1: '张三',
        2: '0',
        4: JSON.stringify(['0']),
      };

      const unanswered = checkNecessaryQuestions(answers, questions);

      expect(unanswered).toEqual([]);
    });
  });

  describe('areAllNecessaryQuestionsAnswered', () => {
    it('应该返回true，当所有必填题都已回答', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [4, JSON.stringify(['0'])],
      ]);

      const result = areAllNecessaryQuestionsAnswered(answers, questions);

      expect(result).toBe(true);
    });

    it('应该返回false，当有必填题未回答', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [4, JSON.stringify(['0'])],
      ]);

      const result = areAllNecessaryQuestionsAnswered(answers, questions);

      expect(result).toBe(false);
    });
  });

  describe('getVisibleUnansweredQuestions', () => {
    it('应该返回所有可见但未回答的问题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [4, JSON.stringify(['0'])],
      ]);

      const unanswered = getVisibleUnansweredQuestions(answers, questions);

      expect(unanswered).toEqual([
        { id: 3, title: '邮箱', reason: 'visible' },
        { id: 6, title: '喜欢的书籍', reason: 'visible' },
      ]);
    });

    it('应该忽略不可见的问题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'], // 选择了"男"，问题5不可见
        [4, JSON.stringify(['1', '2'])], // 没有选择阅读，问题6不可见
      ]);

      const unanswered = getVisibleUnansweredQuestions(answers, questions);

      expect(unanswered).toEqual([{ id: 3, title: '邮箱', reason: 'visible' }]);
    });

    it('应该忽略已回答的问题', () => {
      const questions = createTestQuestions();
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [3, 'test@example.com'],
        [4, JSON.stringify(['0'])],
        [6, '红楼梦'],
      ]);

      const unanswered = getVisibleUnansweredQuestions(answers, questions);

      expect(unanswered).toEqual([]);
    });
  });

  describe('复杂场景测试', () => {
    it('应该正确处理复杂的条件组合', () => {
      const questions = createTestQuestions();

      // 场景1：选择了"其他"性别，但没有填写其他性别说明
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '2'], // 选择了"其他"
        [4, JSON.stringify(['0'])],
      ]);

      let unanswered = checkNecessaryQuestions(answers, questions);
      expect(unanswered).toEqual([{ id: 5, title: '其他性别说明', reason: 'required' }]);

      // 场景2：填写了其他性别说明
      answers.set(5, '自定义性别');
      unanswered = checkNecessaryQuestions(answers, questions);
      expect(unanswered).toEqual([]);
    });

    it('应该正确处理多选题的条件触发', () => {
      const questions = createTestQuestions();

      // 场景1：选择了阅读，触发问题6显示
      const answers = new Map<number, string>([
        [1, '张三'],
        [2, '0'],
        [4, JSON.stringify(['0', '1'])], // 选择了阅读和运动
      ]);

      const unanswered = checkNecessaryQuestions(answers, questions);
      expect(unanswered).toEqual([]);

      let visibleUnanswered = getVisibleUnansweredQuestions(answers, questions);
      expect(visibleUnanswered).toEqual([
        { id: 3, title: '邮箱', reason: 'visible' },
        { id: 6, title: '喜欢的书籍', reason: 'visible' },
      ]);

      // 场景2：没有选择阅读，问题6不可见
      answers.set(4, JSON.stringify(['1', '2'])); // 只选择了运动和音乐

      visibleUnanswered = getVisibleUnansweredQuestions(answers, questions);
      expect(visibleUnanswered).toEqual([{ id: 3, title: '邮箱', reason: 'visible' }]);
    });
  });
});
