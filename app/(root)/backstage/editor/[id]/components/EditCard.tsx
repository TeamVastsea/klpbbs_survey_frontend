import { Button, Checkbox, Group, Input, NumberInput, Select, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Question, Value } from '@/api/QuestionApi';
import AnswerEditor from '@/app/(root)/backstage/editor/[id]/components/AnswerEditor';
import OptionsEditor from '@/app/(root)/backstage/editor/[id]/components/OptionsEditor';

export default function EditCard(props: EditCardProps) {
    const [edit, setEdit] = useState(false);
    const [answerOpened, {
        open: answerOpen,
        close: answerClose,
    }] = useDisclosure(false);
    const [optionsOpened, {
        open: optionsOpen,
        close: optionsClose,
    }] = useDisclosure(false);

    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            content: {
                ...props.question.content,
                title: e.target.value,
            },
        });
    };

    const changeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            content: {
                ...props.question.content,
                content: e.target.value,
            },
        });
    };

    const changeCondition = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            condition: JSON.parse(e.target.value),
        });
    };

    const changeType = (value: string | null) => {
        setEdit(true);
        if (value) {
            props.setQuestion({
                ...props.question,
                type: checkType(value),
            });
        }
    };

    const changeOption = (e: Value[]) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            values: e,
        });
    };

    const changeAnswer = (e: string | undefined) => {
        setEdit(true);

        if (e === undefined) {
            props.setQuestion({
                ...props.question,
                answer: undefined,
            });
            return;
        }

        props.setQuestion({
            ...props.question,
            answer: {
                ...props.question.answer,
                answer: e,
            },
        });
    };

    const changeAllScore = (e: number | string) => {
        setEdit(true);

        if (props.question.answer === undefined) {
            return;
        }

        props.setQuestion({
            ...props.question,
            answer: {
                ...props.question.answer,
                all_points: Number(e),
            },
        });
    };

    const changeSubScore = (e: number | string) => {
        setEdit(true);

        if (props.question.answer === undefined) {
            return;
        }

        props.setQuestion({
            ...props.question,
            answer: {
                ...props.question.answer,
                sub_points: Number(e),
            },
        });
    };

    const changeRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            required: e.target.checked,
        });
    };

    const save = () => {
        setEdit(false);

        props.save && props.save();
    };

    const checkType = (type: string) => {
        switch (type) {
            case '文本':
                return 'Text';
            case '单选':
                return 'SingleChoice';
            case '多选':
                return 'MultipleChoice';
            default:
                return '';
        }
    };

    const parseType = (type: string) => {
        switch (type) {
            case 'Text':
                return '文本';
            case 'SingleChoice':
                return '单选';
            case 'MultipleChoice':
                return '多选';
            default:
                return '';
        }
    };

    return (
        <Stack>
            <Input.Wrapper label="题目标题">
                <Input value={props.question.content.title} onChange={changeTitle} />
            </Input.Wrapper>
            <Input.Wrapper label="题目描述">
                <Input value={props.question.content.content} onChange={changeDescription} />
            </Input.Wrapper>

            <Input.Wrapper label="条件">
                {/* TODO: add condition editor */}
                <Input
                  placeholder="条件"
                  value={props.question.condition == null ? '' : JSON.stringify(props.question.condition)}
                  onChange={changeCondition} />
            </Input.Wrapper>

            <Select
              label="题目类型"
              data={['文本', '多选', '单选']}
              value={parseType(props.question.type)}
              onChange={changeType}
            />

            {(props.question.type === 'SingleChoice' || props.question.type === 'MultipleChoice') && (
                <>
                    <Input.Wrapper label="选项">
                        <Input
                          style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                          component="button"
                          pointer
                          onClick={optionsOpen}>
                            {JSON.stringify(props.question.values)}
                        </Input>
                    </Input.Wrapper>
                    <OptionsEditor
                      options={props.question.values}
                      setOptions={changeOption}
                      opened={optionsOpened}
                      close={optionsClose} />

                    <Input.Wrapper label="答案">
                        <Input
                          style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                          component="button"
                          pointer
                          onClick={answerOpen}
                        >
                            {props.question.answer?.answer}
                        </Input>
                    </Input.Wrapper>
                    <AnswerEditor
                      answer={props.question.answer?.answer}
                      setAnswer={changeAnswer}
                      opened={answerOpened}
                      close={answerClose}
                      options={props.question.values}
                      type={props.question.type}
                    />

                    <NumberInput
                      label="总分"
                      value={props.question.answer?.all_points ?? 0}
                      onChange={changeAllScore}
                    />
                </>
            )}

            {props.question.type === 'MultipleChoice' &&
                <NumberInput
                  label="半分"
                  value={props.question.answer?.sub_points ?? 0}
                  onChange={changeSubScore}
                />
            }

            <Group justify="flex-end">
                <Checkbox
                  checked={props.question.required ?? false}
                  onChange={changeRequired}
                  label="必答题"
                />
                <Button onClick={save} disabled={!edit}>保存</Button>
                {props.cancel && <Button onClick={props.cancel}>取消</Button>}
            </Group>
        </Stack>
    );
}

export interface EditCardProps {
    question: Question;
    setQuestion: (value: Question) => void;
    save?: () => void;
    cancel?: () => void;
    allowCancel?: boolean;
}
