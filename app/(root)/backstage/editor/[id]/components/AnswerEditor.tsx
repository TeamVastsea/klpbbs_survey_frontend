import { Button, Modal, Stack, Text } from '@mantine/core';
import { Value } from '@/api/QuestionApi';
import { SingleChoice } from '@/app/(root)/survey/components/SingleChoice';
import { MultipleChoice } from '@/app/(root)/survey/components/MultipleChoice';

export default function AnswerEditor(props: AnswerEditorProps) {
    const dispatchType = (type: string) => {
        switch (type) {
            case 'SingleChoice':
                return <SingleChoice
                  choice={props.options}
                  value={props.answer}
                  setValue={props.setAnswer} />;
            case 'MultipleChoice':
                return <MultipleChoice
                  choice={props.options}
                  value={props.answer}
                  setValue={props.setAnswer} />;
            default:
                return <Text>暂不支持此类型</Text>;
        }
    };

    return (
        <Modal opened={props.opened} onClose={props.close} title="答案编辑器">
            <Stack>
                {dispatchType(props.type)}
                <Button
                  onClick={() => props.setAnswer(undefined)}
                  fullWidth
                  color="red"
                >
                    清空
                </Button>
            </Stack>
        </Modal>
    );
}

export interface AnswerEditorProps {
    answer: string | undefined;
    options: Value[];
    type: string;
    setAnswer: (value: string | undefined) => void;
    opened: boolean;
    close: () => void;
}
