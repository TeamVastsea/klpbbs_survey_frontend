import {Badge, Button, Card, Center, Group, Image, ScrollArea, Space, Stack, Textarea, TextInput} from '@mantine/core';
import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { SurveyInfo } from '@/api/SurveyApi';

export default function SurveyBasicContentsEditor({
                                                      survey,
                                                      onSave,
                                                      onCancel,
                                                  }: SurveyEditorProps) {
    const [title, setTitle] = useState(survey.title);
    const [description, setDescription] = useState(survey.description);
    const [image, setImage] = useState(survey.image);
    const [budge, setBudge] = useState(survey.budge);
    const [startTime, setStartTime] = useState(new Date(survey.start_date));
    const [endTime, setEndTime] = useState(new Date(survey.end_date));

    const handleSave = () => {
        onSave({
            ...survey,
            title,
            description,
            budge,
            image,
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
                            <Textarea
                              label="描述"
                              value={description}
                              placeholder="请输入描述"
                              onChange={(e) => setDescription(e.currentTarget.value)}
                              mt="mt"
                              autosize
                            />
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
                                        <Center>
                                            {budge}
                                        </Center>
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
                            <Image
                              src={image}
                              alt={title}
                              h={200.5}
                              w={391}
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <DateTimePicker
                                  label="开始时间"
                                  value={startTime}
                                  onChange={(value) => console.log(value)} />
                                <DateTimePicker
                                  label="结束时间"
                                  value={endTime}
                                  onChange={(value) => console.log(value)} />
                            </Stack>

                        </Card.Section>
                    </Card>
                </ScrollArea>

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
