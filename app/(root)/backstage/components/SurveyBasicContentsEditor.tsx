'use client';

import {
    Badge,
    Button,
    Card,
    Center,
    Group,
    Image, Input,
    ScrollArea,
    Stack,
    Switch,
    Textarea,
    TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import SurveyApi, { SurveyInfo } from '@/api/SurveyApi';
import ClickToEdit from '@/components/ClickToEdit';

// UTC -> CST (8 hours)
const ADDED_TIME_STAMP = 28800000;

const handleTimeStamp = {
    utc2cst: (timestamp: number) => new Date(timestamp + ADDED_TIME_STAMP),
    cst2utc: (timestamp: number) => new Date(timestamp - ADDED_TIME_STAMP),
};

export default function SurveyBasicContentsEditor({ survey }: SurveyEditorProps) {
    const [title, setTitle] = useState(survey.title);
    const [description, setDescription] = useState(survey.description);
    const [image, setImage] = useState(survey.image);
    const [budge, setBudge] = useState(survey.budge);
    const [startTime, setStartTime] = useState(
        new Date(handleTimeStamp.utc2cst(new Date(survey.start_date).getTime()))
    );
    const [endTime, setEndTime] = useState(
        new Date(handleTimeStamp.utc2cst(new Date(survey.end_date).getTime()))
    );
    const [allowSubmit, setAllowSubmit] = useState(survey.allow_submit);
    const [allowView, setAllowView] = useState(survey.allow_view);
    const [allowJudge, setAllowJudge] = useState(survey.allow_judge);
    const [allowReSubmit, setAllowReSubmit] = useState(survey.allow_re_submit);

    const handleSave = () => {
        const updatedSurvey: SurveyInfo = {
            ...survey,
            title,
            description,
            budge,
            image,
            start_date: handleTimeStamp.cst2utc(startTime.getTime()).toISOString().split('.')[0],
            end_date: handleTimeStamp.cst2utc(endTime.getTime()).toISOString().split('.')[0],
            allow_submit: allowSubmit,
            allow_view: allowView,
            allow_judge: allowJudge,
            allow_re_submit: allowReSubmit,
        };

        SurveyApi.editSurvey(updatedSurvey)
            .then(() => {
                notifications.show({
                    title: '问卷更新成功',
                    message: '问卷信息已成功更新',
                    color: 'green',
                });
            })
            .catch((error) => {
                notifications.show({
                    title: '更新问卷失败, 请将以下信息反馈给管理员',
                    message: error.toString(),
                    color: 'red',
                });
            });
    };

    const handleCancel = () => {
        setTitle(survey.title);
        setDescription(survey.description);
        setImage(survey.image);
        setBudge(survey.budge);
        setStartTime(new Date(handleTimeStamp.utc2cst(new Date(survey.start_date).getTime())));
        setEndTime(new Date(handleTimeStamp.utc2cst(new Date(survey.end_date).getTime())));
        setAllowSubmit(survey.allow_submit);
        setAllowView(survey.allow_view);
        setAllowJudge(survey.allow_judge);
        setAllowReSubmit(survey.allow_re_submit);

        notifications.show({
            title: '编辑取消',
            message: '已取消对问卷的编辑',
            color: 'yellow',
        });
    };

    return (
        <Center>
            <Stack>
                <ScrollArea h={600}>
                    <Card withBorder radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                            <TextInput
                              label="标题"
                              value={title}
                              placeholder="请输入标题"
                              onChange={(e) => setTitle(e.currentTarget.value)}
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Input.Wrapper label="描述">
                                <ClickToEdit
                                  content={description}
                                  onSave={setDescription}
                                  alwaysShowBar />
                            </Input.Wrapper>
                            {/*<Textarea*/}
                            {/*  label="描述"*/}
                            {/*  value={description}*/}
                            {/*  placeholder="请输入描述"*/}
                            {/*  onChange={(e) => setDescription(e.currentTarget.value)}*/}
                            {/*  mt="mt"*/}
                            {/*  autosize*/}
                            {/*/>*/}
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Group justify="space-between">
                                <Textarea
                                  label="图章"
                                  value={budge}
                                  placeholder="请输入图章"
                                  onChange={(e) => setBudge(e.currentTarget.value)}
                                  mt="mt"
                                  autosize
                                />
                                <Stack>
                                    <Badge variant="light">
                                        <Center>{budge}</Center>
                                    </Badge>
                                </Stack>
                            </Group>
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <TextInput
                              label="图片 URL"
                              value={image}
                              placeholder="请输入图片 URL"
                              onChange={(e) => setImage(e.currentTarget.value)}
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Image src={image} alt={title} h={200.5} w={391} />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <DateTimePicker
                                  label="开始时间"
                                  value={startTime}
                                  valueFormat="YYYY/MM/DD hh:mm"
                                  onChange={(value) => value && setStartTime(value)}
                                />
                                <DateTimePicker
                                  label="结束时间"
                                  value={endTime}
                                  valueFormat="YYYY/MM/DD hh:mm"
                                  onChange={(value) => value && setEndTime(value)}
                                />
                            </Stack>
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <Switch
                                  checked={allowSubmit}
                                  onChange={(e) => setAllowSubmit(e.currentTarget.checked)}
                                  label="允许提交"
                                />
                                <Switch
                                  checked={allowView}
                                  onChange={(e) => setAllowView(e.currentTarget.checked)}
                                  label="允许查看"
                                />
                                <Switch
                                  checked={allowJudge}
                                  onChange={(e) => setAllowJudge(e.currentTarget.checked)}
                                  label="允许评判"
                                />
                                <Switch
                                  checked={allowReSubmit}
                                  onChange={(e) => setAllowReSubmit(e.currentTarget.checked)}
                                  label="允许重新提交"
                                />
                            </Stack>
                        </Card.Section>
                    </Card>
                </ScrollArea>

                <Center>
                    <Group mt="md">
                        <Button onClick={handleCancel} variant="outline">
                            原始
                        </Button>
                        <Button onClick={handleSave}>
                            保存
                        </Button>
                    </Group>
                </Center>
            </Stack>
        </Center>
    );
}

interface SurveyEditorProps {
    survey: SurveyInfo;
}
