'use client';

import { Badge, Button, Card, Center, Group, Paper, Stack, Switch, Textarea, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SurveyApi, { NewSurveyInfo } from '@/api/SurveyApi';
import ConfirmationModal from './components/Confirmation';
import QuestionApi from '@/api/QuestionApi';

const ADDED_TIME_STAMP = 28800000; // 8 hours for CST

const handleTimeStamp = {
    cst2utc: (timestamp: number) => new Date(timestamp - ADDED_TIME_STAMP),
};

export default function NewSurveyPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budge, setBudge] = useState('');
    const [image, setImage] = useState('');
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [allowView, setAllowView] = useState(false);
    const [allowJudge, setAllowJudge] = useState(false);
    const [allowReSubmit, setAllowReSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const checkFull = () => {
        if (!title || !description || !image || !startTime || !endTime) {
            notifications.show({
                title: '表单填写不完整',
                message: '存在未填写字段, 请检查并重新提交',
                color: 'red',
            });
            return false;
        }
        return true;
    };

    const handleConfirm = async () => {
        if (!startTime || !endTime) {
            notifications.show({
                title: '未选择时间',
                message: '请确保选择了开始时间和结束时间',
                color: 'red',
            });
            setLoading(false);
            return;
        }
        setLoading(true);

        const page: string = await QuestionApi.createPage('');

        const newSurvey: NewSurveyInfo = {
            title,
            description,
            budge,
            image,
            page,
            start_date: handleTimeStamp.cst2utc(startTime.getTime()).toISOString().split('.')[0],
            end_date: handleTimeStamp.cst2utc(endTime.getTime()).toISOString().split('.')[0],
            allow_submit: allowSubmit,
            allow_view: allowView,
            allow_judge: allowJudge,
            allow_re_submit: allowReSubmit,
        };

        SurveyApi.newSurvey(newSurvey)
            .then((res) => {
                notifications.show({
                    title: '问卷创建成功',
                    message: '新问卷已成功创建',
                    color: 'green',
                });

                router.push(`/backstage/editor/${res}`);
            })
            .catch((error) => {
                notifications.show({
                    title: '创建问卷失败',
                    message: error.toString(),
                    color: 'red',
                });
                setLoading(false);
            })
            .finally(() => {
                setIsModalOpen(false);
            });
    };

    return (
        <Center>
            <Stack>
                <Center>
                    <Title>新建问卷</Title>
                </Center>
                <Paper w={400}>
                    <Card withBorder radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                            <TextInput
                              label="标题"
                              placeholder="请输入标题"
                              onChange={(e) => setTitle(e.currentTarget.value)}
                              required
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Textarea
                              label="描述"
                              placeholder="请输入描述"
                              onChange={(e) => setDescription(e.currentTarget.value)}
                              mt="mt"
                              autosize
                              required
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Group justify="space-between">
                                <Textarea
                                  label="图章"
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
                              placeholder="请输入图片 URL"
                              onChange={(e) => setImage(e.currentTarget.value)}
                              required
                            />
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <DateTimePicker
                                  label="开始时间"
                                  valueFormat="YYYY/MM/DD hh:mm A"
                                  onChange={(value) => value && setStartTime(value)}
                                  required
                                />
                                <DateTimePicker
                                  label="结束时间"
                                  valueFormat="YYYY/MM/DD hh:mm A"
                                  onChange={(value) => value && setEndTime(value)}
                                  required
                                />
                            </Stack>
                        </Card.Section>

                        <Card.Section withBorder inheritPadding py="xs">
                            <Stack>
                                <Switch
                                  label="允许提交"
                                  onChange={(e) => setAllowSubmit(e.currentTarget.checked)}
                                />
                                <Switch
                                  label="允许查看"
                                  onChange={(e) => setAllowView(e.currentTarget.checked)}
                                />
                                <Switch
                                  label="允许评判"
                                  onChange={(e) => setAllowJudge(e.currentTarget.checked)}
                                />
                                <Switch
                                  label="允许重新提交"
                                  onChange={(e) => setAllowReSubmit(e.currentTarget.checked)}
                                />
                            </Stack>
                        </Card.Section>
                    </Card>
                </Paper>

                <Button
                  loading={loading}
                  onClick={() => {
                        if (checkFull()) {
                            setIsModalOpen(true);
                        }
                    }}>
                    点击创建
                </Button>

                <ConfirmationModal
                  loading={loading}
                  isOpen={isModalOpen}
                  closeModal={() => setIsModalOpen(false)}
                  confirmAction={handleConfirm}
                />
            </Stack>
        </Center>
    );
}
