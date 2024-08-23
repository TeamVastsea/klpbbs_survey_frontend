'use client';

import {
    Badge,
    Button,
    Card,
    Center,
    Group,
    Image,
    ScrollArea,
    Stack,
    Switch,
    Textarea,
    TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { SurveyInfo } from '@/api/SurveyApi';

// UTC -> CST (8 hours)
const ADDED_TIME_STAMP = 28800000;

const handleTimeStamp = {
    utc2cst: (timestamp: number) => new Date(timestamp + ADDED_TIME_STAMP), // Convert UTC to CST
    cst2utc: (timestamp: number) => new Date(timestamp - ADDED_TIME_STAMP), // Convert CST back to UTC
};

export default function SurveyBasicContentsEditor({
                                                      survey,
                                                      onSave,
                                                      onCancel,
                                                  }: SurveyEditorProps) {
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

    // Switch states
    const [allowSubmit, setAllowSubmit] = useState(survey.allow_submit);
    const [allowView, setAllowView] = useState(survey.allow_view);
    const [allowJudge, setAllowJudge] = useState(survey.allow_judge);
    const [allowReSubmit, setAllowReSubmit] = useState(survey.allow_re_submit);

    const handleSave = () => {
        onSave({
            ...survey,
            title,
            description,
            budge,
            image,
            start_date: handleTimeStamp.cst2utc(startTime.getTime()).toISOString(), // Convert to string
            end_date: handleTimeStamp.cst2utc(endTime.getTime()).toISOString(), // Convert to string
            allow_submit: allowSubmit,
            allow_view: allowView,
            allow_judge: allowJudge,
            allow_re_submit: allowReSubmit,
        });
    };

    return (
        <Center>
            <Stack>
                <ScrollArea h={600}>
                    <Card withBorder radius="md">
                        {/* Title and Description */}
                        <Card.Section withBorder inheritPadding py="xs">
                            <TextInput
                              label="标题"
                              value={title}
                              placeholder="请输入标题"
                              onChange={(e) => setTitle(e.currentTarget.value)}
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Textarea
                              label="描述"
                              value={description}
                              placeholder="请输入描述"
                              onChange={(e) => setDescription(e.currentTarget.value)}
                              mt="mt"
                              autosize
                            />
                        </Card.Section>

                        {/* Budge and Image */}
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

                        {/* DateTime Pickers */}
                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <DateTimePicker
                                  label="开始时间"
                                  value={startTime}
                                  valueFormat="YYYY/MM/DD hh:mm"
                                  onChange={(value) => value && setStartTime(value)} // Handle Date object directly
                                />
                                <DateTimePicker
                                  label="结束时间"
                                  value={endTime}
                                  valueFormat="YYYY/MM/DD hh:mm"
                                  onChange={(value) => value && setEndTime(value)} // Handle Date object directly
                                />
                            </Stack>
                        </Card.Section>

                        {/* Switches */}
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

                {/* Buttons */}
                <Center>
                    <Group mt="md">
                        <Button onClick={onCancel} variant="outline">
                            取消
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
    onSave: (updatedSurvey: SurveyInfo) => void;
    onCancel: () => void;
}
