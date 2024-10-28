'use client';

import {
    Box,
    Center,
    Checkbox,
    Group,
    LoadingOverlay,
    Pagination,
    Space,
    Stack,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScoreApi, { AnswerInfo } from '@/api/ScoreApi';
import AsyncPagedSelect from '@/app/(root)/backstage/judge/components/AsyncPagedSelect';

export default function SurveyPage() {
    const [surveySearch, setSurveySearch] = useState<string>('');
    const [unconfirmedOnly, setUnconfirmedOnly] = useState(false);
    const [surveysLoading, setSurveysLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(1);
    const [answers, setAnswers] = useState<AnswerInfo[]>([]);
    const router = useRouter();

    useEffect(() => {
        setSurveysLoading(true);
        ScoreApi.searchAnswerList(page,
            10,
            surveySearch ? Number(surveySearch) : null,
            null,
            unconfirmedOnly)
            .then((res) => {
                setSurveysLoading(false);
                setMaxPage(res.total);
                setAnswers(res.records);
            });
    }, [surveySearch, unconfirmedOnly, page]);

    return (
        <Center>
            <Stack w="90%">
                <Center>
                    <Title>
                        阅卷系统
                    </Title>
                </Center>
                <Center h="100%">
                    <Stack>
                        <Stack>
                            <Box pos="relative">
                                <Group>
                                    <Text>
                                        筛选问卷
                                    </Text>
                                    <AsyncPagedSelect
                                      value={surveySearch}
                                      onChange={setSurveySearch}
                                    />
                                    <Checkbox
                                      onChange={(e) =>
                                          setUnconfirmedOnly(e.currentTarget.checked)}
                                      label="仅显示未确认的问卷"
                                    />
                                </Group>
                            </Box>
                            <Center>
                                <Box pos="relative">
                                    <Stack>
                                        <Space h={10} />
                                        <Table highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>提交ID</Table.Th>
                                                    <Table.Th>问卷ID</Table.Th>
                                                    <Table.Th>用户ID</Table.Th>
                                                    <Table.Th>提交时间</Table.Th>
                                                    <Table.Th>问卷状态</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {answers === undefined ? <></> :
                                                    answers.map((element) => (
                                                    <Table.Tr
                                                      key={element.id}
                                                      onClick={() => router.push(`/backstage/judge/${element.id}`)}
                                                      style={{ cursor: 'pointer' }}>
                                                        <Table.Td>{element.id}</Table.Td>
                                                        <Table.Td>{element.survey}</Table.Td>
                                                        <Table.Td>{element.user}</Table.Td>
                                                        <Table.Td>{element.create_time}</Table.Td>
                                                        <Table.Td>{element.completed ? '已确认' : '待确认'}</Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                        <Center>
                                            <Pagination
                                              total={maxPage}
                                              value={page + 1}
                                              onChange={(e) => setPage(e - 1)} />
                                        </Center>
                                        <Space h={10} />
                                    </Stack>
                                    <LoadingOverlay
                                      visible={surveysLoading}
                                      zIndex={10}
                                      overlayProps={{
                                        radius: 'sm',
                                        blur: 2,
                                    }} />
                                </Box>
                            </Center>
                        </Stack>
                    </Stack>
                </Center>
            </Stack>
        </Center>

    );
}
