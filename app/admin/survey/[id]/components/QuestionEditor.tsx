import { useCallback, useRef, useState } from 'react';
import { Group, Stack, Switch } from '@mantine/core';
import { useFocusWithin } from '@mantine/hooks';
import { Condition, Question } from '@/model/question';
import ChoiceOptionsEditor from './ChoiceOptionsEditor';
import ConditionEditor from './ConditionEditor';
import QuestionTypeAndScore from './QuestionTypeAndScore';
import TitleAndContentEditor from './TitleAndContentEditor';

export default function QuestionEditor(props: QuestionEditorProps) {
  const [type, setType] = useState(props.question.type);
  const [title, setTitle] = useState(props.question.content.title);
  const [content, setContent] = useState(props.question.content.content || '');
  const [values, setValues] = useState(props.question.values || []);
  const [answer, setAnswer] = useState<string | string[] | undefined>(
    props.question.answer?.answer
      ? type === 'MultipleChoice'
        ? JSON.parse(props.question.answer.answer)
        : props.question.answer.answer
      : type === 'MultipleChoice'
        ? []
        : ''
  );
  const [allPoints, setAllPoints] = useState(props.question.answer?.all_points ?? '');
  const [subPoints, setSubPoints] = useState(props.question.answer?.sub_points ?? '');
  const [required, setRequired] = useState(props.question.required ?? true);
  const [conditions, setConditions] = useState<Condition[]>(props.question.condition || []);
  // 使用ref但不在onBlur时自动保存，避免频繁触发保存
  const { ref } = useFocusWithin();
  // 添加防抖逻辑，避免频繁保存
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 使用防抖函数包装保存操作，避免频繁保存
  const debouncedSave = useCallback(() => {
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 设置新的定时器，延迟500ms执行保存
    saveTimeoutRef.current = setTimeout(() => {
      const newQuestion: Question = {
        ...props.question,
        type,
        content: {
          ...props.question.content,
          title,
          content,
        },
        values: type === 'SingleChoice' || type === 'MultipleChoice' ? values : [],
        answer:
          type === 'SingleChoice' || type === 'MultipleChoice'
            ? {
                answer:
                  answer !== undefined
                    ? type === 'MultipleChoice'
                      ? JSON.stringify(answer)
                      : (answer as string)
                    : '',
                all_points: allPoints === '' ? undefined : Number(allPoints),
                sub_points:
                  type === 'MultipleChoice' && subPoints !== '' ? Number(subPoints) : undefined,
              }
            : undefined,
        required,
        condition: conditions.length > 0 ? conditions : undefined,
      };
      props.onSave(newQuestion);
    }, 500); // 500ms的防抖延迟
  }, [type, title, content, values, answer, allPoints, subPoints, required, conditions, props]);

  // 暴露给子组件的保存函数
  const handleSave = useCallback(() => {
    debouncedSave();
  }, [debouncedSave]);

  // 获取可用于条件的问题列表
  const availableQuestions = props.availableQuestions || [];

  return (
    <div
      ref={ref}
      style={{
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        width: '100%',
      }}
    >
      <Stack style={{ width: '100%' }}>
        <Group justify="space-between">
          <QuestionTypeAndScore
            type={type}
            setType={setType}
            allPoints={allPoints}
            setAllPoints={setAllPoints}
            subPoints={subPoints}
            setSubPoints={setSubPoints}
          />
          {props.dragHandle}
        </Group>
        <TitleAndContentEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onBlur={handleSave}
        />
        {(type === 'SingleChoice' || type === 'MultipleChoice') && (
          <ChoiceOptionsEditor
            type={type}
            values={values}
            setValues={setValues}
            answer={answer}
            setAnswer={setAnswer}
            handleSave={handleSave}
          />
        )}
        <Group>
          <Switch
            label="必填"
            checked={required}
            onChange={(event) => {
              setRequired(event.currentTarget.checked);
              // 状态变化后立即保存
              setTimeout(handleSave, 0);
            }}
          />
        </Group>
        <ConditionEditor
          conditions={conditions}
          setConditions={setConditions}
          availableQuestions={availableQuestions}
          handleSave={handleSave}
        />
      </Stack>
    </div>
  );
}

export interface QuestionEditorProps {
  question: Question;
  dragHandle?: React.ReactNode;
  onSave: (question: Question) => void;
  availableQuestions?: { id: number; title: string }[];
}
