import {useState} from 'react';
import {Stack} from '@mantine/core';
import {useFocusWithin} from '@mantine/hooks';
import TextQuestion from '@/components/Question/TextQuestion';
import {Question} from '@/model/question';
import QuestionTypeAndScore from './QuestionTypeAndScore';
import TitleAndContentEditor from './TitleAndContentEditor';
import ChoiceOptionsEditor from './ChoiceOptionsEditor';

export default function QuestionEditor(props: QuestionEditorProps) {
  const [type, setType] = useState(props.question.type);
  const [title, setTitle] = useState(props.question.content.title);
  const [content, setContent] = useState(props.question.content.content || '');
  const [values, setValues] = useState(props.question.values || []);
  const [answer, setAnswer] = useState<string | string[] | undefined>(props.question.answer?.answer ? (type === 'MultipleChoice' ? JSON.parse(props.question.answer.answer) : props.question.answer.answer) : (type === 'MultipleChoice' ? [] : ''));
  const [allPoints, setAllPoints] = useState(props.question.answer?.all_points ?? '');
  const [subPoints, setSubPoints] = useState(props.question.answer?.sub_points ?? '');
  const {ref} = useFocusWithin({
    onBlur: () => {
      handleSave();
    },
  });
  const handleSave = () => {
    const newQuestion: Question = {
      ...props.question,
      type,
      content: {
        ...props.question.content,
        title,
        content,
      },
      values: type === 'SingleChoice' || type === 'MultipleChoice' ? values : [],
      answer: (type === 'SingleChoice' || type === 'MultipleChoice') ? {
        answer: answer !== undefined ? (type === 'MultipleChoice' ? JSON.stringify(answer) : answer as string) : '',
        all_points: allPoints === '' ? undefined : Number(allPoints),
        sub_points: type === 'MultipleChoice' && subPoints !== '' ? Number(subPoints) : undefined,
      } : undefined,
    };
    props.onSave(newQuestion);
  };
  return (
    <div ref={ref} style={{border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16}}>
      <Stack>
        <QuestionTypeAndScore
          type={type}
          allPoints={allPoints}
          setAllPoints={setAllPoints}
          subPoints={subPoints}
          setSubPoints={setSubPoints}
        />
        <TitleAndContentEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onBlur={handleSave}
        />
        {type === 'Text' && (
          <TextQuestion {...props} value="" setValue={() => {}} />
        )}
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
  onSave: (question: Question) => void;
}
