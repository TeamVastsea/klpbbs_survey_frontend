import { useCallback } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { Condition, ConditionInner } from '@/model/question';

export interface ConditionEditorProps {
  conditions: Condition[];
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  availableQuestions: {
    id: number;
    title: string;
    type?: string;
    values?: { title: string; content: string }[];
  }[];
  handleSave: () => void;
}

export default function ConditionEditor({
  conditions,
  setConditions,
  availableQuestions,
  handleSave,
}: ConditionEditorProps) {
  // 添加一个新的条件组
  const addConditionGroup = useCallback(() => {
    const newCondition: Condition = {
      type: 'and',
      conditions: [],
    };
    setConditions([...conditions, newCondition]);
    handleSave();
  }, [conditions, setConditions, handleSave]);

  // 删除条件组
  const removeConditionGroup = useCallback(
    (index: number) => {
      const newConditions = [...conditions];
      newConditions.splice(index, 1);
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, handleSave]
  );

  // 更新条件组类型
  const updateConditionType = useCallback(
    (index: number, type: 'and' | 'or' | 'not') => {
      const newConditions = [...conditions];
      newConditions[index].type = type;
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, handleSave]
  );

  // 添加内部条件
  const addInnerCondition = useCallback(
    (groupIndex: number) => {
      const newConditions = [...conditions];
      const newInnerCondition: ConditionInner = {
        id: availableQuestions.length > 0 ? availableQuestions[0].id : 0,
        value: '',
      };
      newConditions[groupIndex].conditions.push(newInnerCondition);
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, availableQuestions, handleSave]
  );

  // 删除内部条件
  const removeInnerCondition = useCallback(
    (groupIndex: number, innerIndex: number) => {
      const newConditions = [...conditions];
      newConditions[groupIndex].conditions.splice(innerIndex, 1);
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, handleSave]
  );

  // 更新内部条件问题ID
  const updateInnerConditionId = useCallback(
    (groupIndex: number, innerIndex: number, id: number) => {
      const newConditions = [...conditions];
      newConditions[groupIndex].conditions[innerIndex].id = id;
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, handleSave]
  );

  // 更新内部条件值
  const updateInnerConditionValue = useCallback(
    (groupIndex: number, innerIndex: number, value: any) => {
      const newConditions = [...conditions];
      newConditions[groupIndex].conditions[innerIndex].value = value;
      setConditions(newConditions);
      handleSave();
    },
    [conditions, setConditions, handleSave]
  );

  // 获取问题的类型
  const getQuestionType = useCallback(
    (questionId: number) => {
      const question = availableQuestions.find((q) => q.id === questionId);
      return question?.type || '';
    },
    [availableQuestions]
  );

  // 获取问题的选项
  const getQuestionOptions = useCallback(
    (questionId: number) => {
      const question = availableQuestions.find((q) => q.id === questionId);
      return question?.values || [];
    },
    [availableQuestions]
  );

  // 根据问题类型生成答案选项
  const getAnswerOptions = useCallback(
    (questionId: number) => {
      const questionType = getQuestionType(questionId);
      const options = getQuestionOptions(questionId);

      if (questionType === 'SingleChoice' || questionType === 'MultipleChoice') {
        return [
          { value: 'answered', label: '已回答' },
          { value: 'unanswered', label: '未回答' },
          ...options.map((option, index) => ({
            value: index.toString(),
            label: `选择了: ${option.title}`,
          })),
        ];
      }

      return [
        { value: 'answered', label: '已回答' },
        { value: 'unanswered', label: '未回答' },
      ];
    },
    [getQuestionType, getQuestionOptions]
  );

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text fw={500}>显示条件</Text>
        <Button size="xs" onClick={addConditionGroup}>
          添加条件组
        </Button>
      </Group>

      {!conditions || conditions.length === 0 ? (
        <Text c="dimmed" size="sm">
          无条件限制，始终显示
        </Text>
      ) : (
        conditions.map((conditionGroup, groupIndex) => (
          <Paper key={groupIndex} p="xs" withBorder>
            <Stack>
              <Group>
                <Select
                  size="xs"
                  value={conditionGroup.type}
                  onChange={(value) =>
                    updateConditionType(groupIndex, value as 'and' | 'or' | 'not')
                  }
                  data={[
                    { value: 'and', label: '全部满足 (AND)' },
                    { value: 'or', label: '任一满足 (OR)' },
                    { value: 'not', label: '全部不满足 (NOT)' },
                  ]}
                  style={{ width: 200 }}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => removeConditionGroup(groupIndex)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              {conditionGroup.conditions.length === 0 ? (
                <Text c="dimmed" size="xs">
                  请添加条件
                </Text>
              ) : (
                conditionGroup.conditions.map(
                  (innerCondition: ConditionInner, innerIndex: number) => (
                    <Box key={innerIndex} pl={10}>
                      <Group>
                        <Select
                          size="xs"
                          placeholder="选择问题"
                          value={innerCondition.id.toString()}
                          onChange={(value) =>
                            updateInnerConditionId(groupIndex, innerIndex, parseInt(value || '0', 10))
                          }
                          data={availableQuestions.map((q) => ({
                            value: q.id.toString(),
                            label: q.title,
                          }))}
                          style={{ flex: 1 }}
                        />
                        {getQuestionType(innerCondition.id) === 'MultipleChoice' ? (
                          <MultiSelect
                            size="xs"
                            placeholder="选择答案"
                            value={Array.isArray(innerCondition.value) ? innerCondition.value : []}
                            onChange={(value) =>
                              updateInnerConditionValue(groupIndex, innerIndex, value)
                            }
                            data={getAnswerOptions(innerCondition.id).filter(
                              (option) => option.value !== 'true' && option.value !== 'false'
                            )}
                            style={{ width: 200 }}
                          />
                        ) : (
                          <Select
                            size="xs"
                            placeholder="选择答案"
                            value={innerCondition.value}
                            onChange={(value) =>
                              updateInnerConditionValue(groupIndex, innerIndex, value)
                            }
                            data={getAnswerOptions(innerCondition.id)}
                            style={{ width: 200 }}
                          />
                        )}
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => removeInnerCondition(groupIndex, innerIndex)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  )
                )
              )}

              <Button
                size="xs"
                variant="outline"
                leftSection={<IconPlus size={14} />}
                onClick={() => addInnerCondition(groupIndex)}
              >
                添加条件
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}
