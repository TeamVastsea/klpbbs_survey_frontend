import { Button, Checkbox, Input, NumberInput, Select, Space, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { QuestionProps, Value } from '@/app/(root)/survey/components/generateQuestion';
import AnswerEditor from '@/app/(root)/backstage/editor/[id]/components/AnswerEditor';
import OptionsEditor from '@/app/(root)/backstage/editor/[id]/components/OptionsEditor';

export default function EditCard(props: EditCardProps) {
    const [edit, setEdit] = useState(false);
    const [answerOpened, { open: answerOpen, close: answerClose }] = useDisclosure(false);
    const [optionsOpened, { open: optionsOpen, close: optionsClose }] = useDisclosure(false);

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
            condition: e.target.value,
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

        props.setQuestion({
            ...props.question,
            answer: e, // 更新答案字段
        });
    };

    const changeAllScore = (e: number | string) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            all_points: Number(e), // 更新总分字段
        });
    };

    const changeSubScore = (e: number | string) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            sub_points: Number(e), // 更新总分字段
        });
    };

    const changeRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(true);
        props.setQuestion({
            ...props.question,
            required: e.target.checked,
        });
    };

    function save() {
        setEdit(false);

        // TODO: save to server
    }

    function mapType(type: number) {
        switch (type) {
            case 1:
                return '文本';
            case 2:
                return '多选';
            case 3:
                return '单选';
            default:
                return '';
        }
    }

    function checkType(type: string) {
        switch (type) {
            case '文本':
                return 1;
            case '多选':
                return 2;
            case '单选':
                return 3;
            default:
                return 0;
        }
    }

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
                <Input placeholder="条件" value={props.question.condition == null ? '' : props.question.condition} onChange={changeCondition} />
            </Input.Wrapper>

            <Select
              label="题目类型"
              data={['文本', '多选', '单选']}
              value={mapType(props.question.type)}
              onChange={changeType}
            />

            {(props.question.type === 2 || props.question.type === 3) && (
                <>
                    <Input.Wrapper label="选项">
                        <Input component="button" pointer onClick={optionsOpen}>
                            <Input.Placeholder>
                                {JSON.stringify(props.question.values)}
                            </Input.Placeholder>
                        </Input>
                    </Input.Wrapper>
                    <OptionsEditor
                      options={props.question.values}
                      setOptions={changeOption}
                      opened={optionsOpened}
                      close={optionsClose} />

                    <Input.Wrapper label="答案">
                        <Input component="button" pointer onClick={answerOpen}>
                            <Input.Placeholder>{props.question.answer}</Input.Placeholder>
                        </Input>
                    </Input.Wrapper>
                    <AnswerEditor
                      answer={props.question.answer}
                      setAnswer={changeAnswer}
                      opened={answerOpened}
                      close={answerClose}
                      options={props.question.values}
                      type={props.question.type}
                    />

                    <NumberInput
                      label="总分"
                      value={props.question.all_points ?? 0}
                      onChange={changeAllScore}
                    />
                </>
            )}

            {props.question.type === 3 &&
                <NumberInput
                  label="半分"
                  value={props.question.sub_points ?? 0}
                  onChange={changeSubScore}
                />
            }

            <Checkbox
              checked={props.question.required ?? false}
              onChange={changeRequired}
              label="必答题"
            />

            <Space h={20} />
            <Button onClick={save} disabled={!edit}>保存</Button>
        </Stack>
    );
}

export interface EditCardProps {
    question: QuestionProps;
    setQuestion: (value: QuestionProps) => void;
}
