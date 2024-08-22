import {
  TextInput,
  Textarea,
  Button,
  Group,
  Center,
  Stack,
  Image,
  Card,
  Badge,
} from '@mantine/core';
import { useState } from 'react';
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

    const handleSave = () => {
        onSave({ ...survey, title, description, budge, image });
    };

    return (
        <Center>
            <Stack w={391}>
                <Card withBorder shadow="sm" radius="md" w={391}>
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

                    <Card.Section mt="sm" h={150}>
                        <Image
                          src={image}
                          alt={title}
                          h={200.5}
                          w={391}
                        />
                    </Card.Section>
                </Card>

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
