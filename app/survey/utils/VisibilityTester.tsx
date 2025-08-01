'use client';

import { useEffect, useState } from 'react';
import { Card, Checkbox, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { Question } from '@/model/question';
import { checkVisibility } from './visibility';

/**
 * 条件可见性测试组件
 * 用于测试不同条件组合下问题的可见性
 */
export default function VisibilityTester() {
  // 创建测试问题
  const questions: Question[] = [
    // 问题1：无条件，始终显示
    {
      id: 1,
      page: 1,
      type: 'Text',
      content: { title: '问题1（文本题）', content: '这是一个文本题' },
      values: [],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题2：单选题
    {
      id: 2,
      page: 1,
      type: 'SingleChoice',
      content: { title: '问题2（单选题）', content: '这是一个单选题' },
      values: [
        { title: '选项1', content: '选项1' },
        { title: '选项2', content: '选项2' },
      ],
      condition: undefined,
      required: true,
      answer: undefined,
    },
    // 问题3：多选题
    {
      id: 3,
      page: 1,
      type: 'MultipleChoice',
      content: { title: '问题3（多选题）', content: '这是一个多选题' },
      values: [
        { title: '选项A', content: '选项A' },
        { title: '选项B', content: '选项B' },
        { title: '选项C', content: '选项C' },
      ],
      condition: undefined,
      required: false,
      answer: undefined,
    },
    // 问题4：条件问题
    {
      id: 4,
      page: 1,
      type: 'Text',
      content: { title: '问题4（条件问题）', content: '这个问题有显示条件' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 1, value: 'answered' }],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题5：条件问题
    {
      id: 5,
      page: 1,
      type: 'Text',
      content: { title: '问题5（条件问题）', content: '这个问题有显示条件' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 2, value: '0' }],
        },
      ],
      required: false,
      answer: undefined,
    },
    // 问题6：条件问题
    {
      id: 6,
      page: 1,
      type: 'Text',
      content: { title: '问题6（条件问题）', content: '这个问题有显示条件' },
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
  ];

  // 用户回答
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());

  // 计算问题可见性
  const [visibility, setVisibility] = useState<boolean[]>([]);

  // 当回答或问题变化时，重新计算可见性
  useEffect(() => {
    setVisibility(checkVisibility(answers, questions));
  }, [answers, questions]);

  // 更新文本回答
  const updateTextAnswer = (id: number, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(id, value);
    setAnswers(newAnswers);
  };

  // 更新单选题回答
  const updateSingleChoiceAnswer = (id: number, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(id, value);
    setAnswers(newAnswers);
  };

  // 更新多选题回答
  const updateMultipleChoiceAnswer = (id: number, optionIndex: string, checked: boolean) => {
    const newAnswers = new Map(answers);
    const currentAnswer = answers.get(id);
    let selectedOptions: string[] = [];

    try {
      if (currentAnswer) {
        selectedOptions = JSON.parse(currentAnswer);
      }
    } catch (e) {
      // 解析错误，重置选项
    }

    if (checked && !selectedOptions.includes(optionIndex)) {
      selectedOptions.push(optionIndex);
    } else if (!checked) {
      selectedOptions = selectedOptions.filter((option) => option !== optionIndex);
    }

    newAnswers.set(id, JSON.stringify(selectedOptions));
    setAnswers(newAnswers);
  };

  return (
    <Stack gap="xl">
      <Title order={2}>条件可见性测试</Title>

      <Group grow>
        <Stack gap="md" style={{ flex: 1 }}>
          <Title order={3}>问题列表</Title>

          {questions.map((question, index) => (
            <Card key={question.id} shadow="sm" padding="lg" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={700}>{question.content.title}</Text>
                  <Text c={visibility[index] ? 'green' : 'red'}>
                    {visibility[index] ? '可见' : '不可见'}
                  </Text>
                </Group>

                <Text size="sm">{question.content.content}</Text>

                {question.type === 'Text' && (
                  <TextInput
                    placeholder="输入回答"
                    value={answers.get(question.id) || ''}
                    onChange={(e) => updateTextAnswer(question.id, e.target.value)}
                  />
                )}

                {question.type === 'SingleChoice' && (
                  <Select
                    placeholder="选择一个选项"
                    value={answers.get(question.id) || ''}
                    onChange={(value) => updateSingleChoiceAnswer(question.id, value || '')}
                    data={question.values.map((value, idx) => ({
                      value: idx.toString(),
                      label: value.title,
                    }))}
                  />
                )}

                {question.type === 'MultipleChoice' && (
                  <Stack gap="xs">
                    {question.values.map((value, idx) => {
                      const currentAnswer = answers.get(question.id) || '[]';
                      let selectedOptions: string[] = [];
                      try {
                        selectedOptions = JSON.parse(currentAnswer);
                      } catch (e) {
                        /* empty */
                      }

                      return (
                        <Checkbox
                          key={idx}
                          label={value.title}
                          checked={selectedOptions.includes(idx.toString())}
                          onChange={(e) =>
                            updateMultipleChoiceAnswer(
                              question.id,
                              idx.toString(),
                              e.target.checked
                            )
                          }
                        />
                      );
                    })}
                  </Stack>
                )}

                {question.id > 3 && (
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      显示条件:
                    </Text>
                    {question.condition?.map((conditionGroup, groupIdx) => (
                      <Card key={groupIdx} padding="xs" withBorder>
                        <Text size="sm">
                          条件组 {groupIdx + 1} (类型: {conditionGroup.type})
                        </Text>
                        <Stack gap={5}>
                          {conditionGroup.conditions.map((condition, condIdx) => {
                            return (
                              <Text key={condIdx} size="xs">
                                问题{condition.id}
                                {condition.value === 'answered'
                                  ? '已回答'
                                  : condition.value === 'unanswered'
                                    ? '未回答'
                                    : `选择了 ${condition.value}`}
                              </Text>
                            );
                          })}
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>

        <Stack gap="md" style={{ flex: 1 }}>
          <Title order={3}>当前回答</Title>
          <Card shadow="sm" padding="lg" withBorder>
            <Stack gap="md">
              {Array.from(answers.entries()).map(([id, value]) => {
                const question = questions.find((q) => q.id === Number(id));
                if (!question) {
                  return null;
                }

                return (
                  <Group key={id} justify="space-between">
                    <Text>{question.content.title}:</Text>
                    <Text>
                      {question.type === 'MultipleChoice'
                        ? `选择了 ${JSON.parse(value)
                            .map((v: string) => question.values[Number(v)]?.title || v)
                            .join(', ')}`
                        : question.type === 'SingleChoice'
                          ? `选择了 ${question.values[Number(value)]?.title || value}`
                          : value}
                    </Text>
                  </Group>
                );
              })}

              {answers.size === 0 && <Text c="dimmed">暂无回答</Text>}
            </Stack>
          </Card>

          <Title order={3}>可见性结果</Title>
          <Card shadow="sm" padding="lg" withBorder>
            <Stack gap="md">
              {questions.map((question, index) => (
                <Group key={question.id} justify="space-between">
                  <Text>{question.content.title}:</Text>
                  <Text c={visibility[index] ? 'green' : 'red'}>
                    {visibility[index] ? '可见' : '不可见'}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Group>
    </Stack>
  );
}
