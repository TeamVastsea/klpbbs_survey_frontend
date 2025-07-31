'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Group, Select, Stack, Text, TextInput, Title, Alert, Badge } from '@mantine/core';
import { checkNecessaryQuestions, areAllNecessaryQuestionsAnswered, getVisibleUnansweredQuestions } from './validate';
import { checkVisibility } from './visibility';
import { Question } from '@/model/question';

export default function ValidateTester() {
  // 创建测试问题
  const [questions, setQuestions] = useState<Question[]>([
    // 问题1：必填文本题
    {
      id: 1,
      page: 1,
      type: 'Text',
      content: { title: '姓名（必填）', content: '请输入您的姓名' },
      values: [],
      condition: undefined,
      required: true,
      answer: undefined
    },
    // 问题2：必填单选题
    {
      id: 2,
      page: 1,
      type: 'SingleChoice',
      content: { title: '性别（必填）', content: '请选择您的性别' },
      values: [
        { title: '男', content: '男' },
        { title: '女', content: '女' },
        { title: '其他', content: '其他' }
      ],
      condition: undefined,
      required: true,
      answer: undefined
    },
    // 问题3：非必填文本题
    {
      id: 3,
      page: 1,
      type: 'Text',
      content: { title: '邮箱（选填）', content: '请输入您的邮箱' },
      values: [],
      condition: undefined,
      required: false,
      answer: undefined
    },
    // 问题4：必填多选题
    {
      id: 4,
      page: 1,
      type: 'MultipleChoice',
      content: { title: '兴趣爱好（必填）', content: '请选择您的兴趣爱好（至少选择一项）' },
      values: [
        { title: '阅读', content: '阅读' },
        { title: '运动', content: '运动' },
        { title: '音乐', content: '音乐' },
        { title: '旅行', content: '旅行' }
      ],
      condition: undefined,
      required: true,
      answer: undefined
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
          conditions: [{ id: 2, value: '2' }]
        }
      ],
      required: true,
      answer: undefined
    },
    // 问题6：条件问题（如果选择了阅读或音乐，则显示）
    {
      id: 6,
      page: 1,
      type: 'Text',
      content: { title: '喜欢的书籍或音乐', content: '请分享您喜欢的书籍或音乐' },
      values: [],
      condition: [
        {
          type: 'or',
          conditions: [
            { id: 4, value: '0' },
            { id: 4, value: '2' }
          ]
        }
      ],
      required: false,
      answer: undefined
    },
    // 问题7：非必填条件问题
    {
      id: 7,
      page: 1,
      type: 'Text',
      content: { title: '其他建议', content: '您有什么其他建议吗？' },
      values: [],
      condition: [
        {
          type: 'and',
          conditions: [{ id: 1, value: 'answered' }]
        }
      ],
      required: false,
      answer: undefined
    }
  ]);

  // 用户回答
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  
  // 计算问题可见性
  const [visibility, setVisibility] = useState<boolean[]>([]);
  
  // 计算未回答的必要问题
  const [unansweredQuestions, setUnansweredQuestions] = useState<any[]>([]);
  
  // 计算所有可见但未回答的问题
  const [visibleUnanswered, setVisibleUnanswered] = useState<any[]>([]);
  
  // 检查是否所有必要问题都已回答
  const [allAnswered, setAllAnswered] = useState<boolean>(false);

  // 当回答或问题变化时，重新计算
  useEffect(() => {
    const newVisibility = checkVisibility(answers, questions);
    const newUnanswered = checkNecessaryQuestions(answers, questions);
    const newVisibleUnanswered = getVisibleUnansweredQuestions(answers, questions);
    const newAllAnswered = areAllNecessaryQuestionsAnswered(answers, questions);
    
    setVisibility(newVisibility);
    setUnansweredQuestions(newUnanswered);
    setVisibleUnanswered(newVisibleUnanswered);
    setAllAnswered(newAllAnswered);
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
      selectedOptions = selectedOptions.filter(option => option !== optionIndex);
    }
    
    newAnswers.set(id, JSON.stringify(selectedOptions));
    setAnswers(newAnswers);
  };

  // 清空所有回答
  const clearAllAnswers = () => {
    setAnswers(new Map());
  };

  return (
    <Stack gap="xl">
      <Title order={2}>必要题目检查测试</Title>
      
      {/* 状态显示 */}
      <Card shadow="sm" padding="lg" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={700}>问卷完成状态</Text>
            <Badge 
              color={allAnswered ? 'green' : 'red'} 
              size="lg"
            >
              {allAnswered ? '已完成' : '未完成'}
            </Badge>
          </Group>
          
          {unansweredQuestions.length > 0 && (
            <Alert color="red" title="必填题未完成">
              以下必填题尚未回答：
              <ul>
                {unansweredQuestions.map(q => (
                  <li key={q.id}>{q.title}</li>
                ))}
              </ul>
            </Alert>
          )}
          
          <Text size="sm">
            可见问题：{visibility.filter(v => v).length} / {visibility.length}
          </Text>
          <Text size="sm">
            未回答的必填题：{unansweredQuestions.length} 个
          </Text>
          <Text size="sm">
            可见但未回答的问题：{visibleUnanswered.length} 个
          </Text>
          
          <Button onClick={clearAllAnswers} color="gray" variant="outline">
            清空所有回答
          </Button>
        </Stack>
      </Card>
      
      <Group grow>
        <Stack gap="md" style={{ flex: 1 }}>
          <Title order={3}>问题列表</Title>
          
          {questions.map((question, index) => (
            <Card 
              key={question.id} 
              shadow="sm" 
              padding="lg" 
              withBorder
              style={{ 
                opacity: visibility[index] ? 1 : 0.5,
                border: visibility[index] ? undefined : '2px dashed #ccc'
              }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Group>
                    <Text fw={700}>{question.content.title}</Text>
                    {question.required && <Badge color="red" size="sm" ml="xs">必填</Badge>}
                  </Group>
                  <Group gap="xs">
                    <Badge 
                      color={visibility[index] ? 'green' : 'gray'}
                      variant="outline"
                    >
                      {visibility[index] ? '可见' : '隐藏'}
                    </Badge>
                    {visibility[index] && !answers.has(question.id) && (
                      <Badge color="orange">未回答</Badge>
                    )}
                  </Group>
                </Group>
                
                <Text size="sm">{question.content.content}</Text>
                
                {visibility[index] && (
                  <>
                    {question.type === 'Text' && (
                      <TextInput
                        placeholder="输入回答"
                        value={answers.get(question.id) || ''}
                        onChange={(e) => updateTextAnswer(question.id, e.target.value)}
                        required={question.required}
                      />
                    )}
                    
                    {question.type === 'SingleChoice' && (
                      <Select
                        placeholder="选择一个选项"
                        value={answers.get(question.id) || ''}
                        onChange={(value) => updateSingleChoiceAnswer(question.id, value || '')}
                        data={question.values.map((value, idx) => ({
                          value: idx.toString(),
                          label: value.title
                        }))}
                        required={question.required}
                      />
                    )}
                    
                    {question.type === 'MultipleChoice' && (
                      <Stack gap="xs">
                        {question.values.map((value, idx) => {
                          const currentAnswer = answers.get(question.id) || '[]';
                          let selectedOptions: string[] = [];
                          try {
                            selectedOptions = JSON.parse(currentAnswer);
                          } catch (e) {}
                          
                          return (
                            <Checkbox
                              key={idx}
                              label={value.title}
                              checked={selectedOptions.includes(idx.toString())}
                              onChange={(e) => updateMultipleChoiceAnswer(
                                question.id,
                                idx.toString(),
                                e.target.checked
                              )}
                            />
                          );
                        })}
                      </Stack>
                    )}
                  </>
                )}
                
                {question.condition && question.condition.length > 0 && (
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>显示条件:</Text>
                    {question.condition.map((conditionGroup, groupIdx) => (
                      <Card key={groupIdx} padding="xs" withBorder>
                        <Text size="sm">条件组 {groupIdx + 1} (类型: {conditionGroup.type})</Text>
                        <Stack gap={5}>
                          {conditionGroup.conditions.map((condition, condIdx) => {
                            const targetQuestion = questions.find(q => q.id === condition.id);
                            return (
                              <Text key={condIdx} size="xs">
                                问题{condition.id} 
                                {condition.value === 'answered' ? '已回答' : 
                                 condition.value === 'unanswered' ? '未回答' : 
                                 `选择了 ${targetQuestion?.values[Number(condition.value)]?.title || condition.value}`}
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
                const question = questions.find(q => q.id === Number(id));
                if (!question) return null;
                
                return (
                  <Group key={id} justify="space-between">
                    <Text>{question.content.title}:</Text>
                    <Text>
                      {question.type === 'MultipleChoice' 
                        ? `选择了 ${JSON.parse(value).map((v: string) => 
                            question.values[Number(v)]?.title || v
                          ).join(', ')}` 
                        : question.type === 'SingleChoice'
                          ? `选择了 ${question.values[Number(value)]?.title || value}`
                          : value}
                    </Text>
                  </Group>
                );
              })}
              
              {answers.size === 0 && (
                <Text c="dimmed">暂无回答</Text>
              )}
            </Stack>
          </Card>
          
          <Title order={3}>检查结果</Title>
          <Card shadow="sm" padding="lg" withBorder>
            <Stack gap="md">
              <Text fw={700}>未回答的必填题</Text>
              {unansweredQuestions.length > 0 ? (
                <Stack gap="xs">
                  {unansweredQuestions.map(q => (
                    <Text key={q.id} c="red">{q.title}</Text>
                  ))}
                </Stack>
              ) : (
                <Text c="green">所有必填题已回答</Text>
              )}
              
              <Text fw={700}>可见但未回答的问题</Text>
              {visibleUnanswered.length > 0 ? (
                <Stack gap="xs">
                  {visibleUnanswered.map(q => (
                    <Text key={q.id} c="orange">{q.title}</Text>
                  ))}
                </Stack>
              ) : (
                <Text c="green">所有可见问题已回答</Text>
              )}
            </Stack>
          </Card>
        </Stack>
      </Group>
    </Stack>
  );
}