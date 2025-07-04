import { useCallback, useRef, useState } from 'react';
import { Group, Stack } from '@mantine/core';
import { useFocusWithin } from '@mantine/hooks';
import { Question } from '@/model/question';
import ChoiceOptionsEditor from './ChoiceOptionsEditor';
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
      // 检查是否有实际变化，避免不必要的保存
      if (
        type === props.question.type &&
        title === props.question.content.title &&
        content === (props.question.content.content || '') &&
        JSON.stringify(values) === JSON.stringify(props.question.values || []) &&
        JSON.stringify(answer) ===
          JSON.stringify(
            props.question.answer?.answer
              ? props.question.type === 'MultipleChoice'
                ? JSON.parse(props.question.answer.answer)
                : props.question.answer.answer
              : props.question.type === 'MultipleChoice'
                ? []
                : ''
          ) &&
        allPoints === (props.question.answer?.all_points ?? '') &&
        subPoints === (props.question.answer?.sub_points ?? '')
      ) {
        return; // 没有变化，不需要保存
      }

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
      };
      props.onSave(newQuestion);
    }, 500); // 500ms的防抖延迟
  }, [type, title, content, values, answer, allPoints, subPoints, props]);

  // 暴露给子组件的保存函数
  const handleSave = useCallback(() => {
    debouncedSave();
  }, [debouncedSave]);
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
      </Stack>
    </div>
  );
}

export interface QuestionEditorProps {
  question: Question;
  dragHandle?: React.ReactNode;
  onSave: (question: Question) => void;
}
