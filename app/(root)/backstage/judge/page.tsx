'use client';

import {
    Box,
    Center,
    Checkbox,
    Group,
    Input,
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
import AnswerApi, { AnswerInfo } from '@/api/AnswerApi';

export default function SurveyPage() {
    const [surveySearch, setSurveySearch] = useState<string | null>(null);
    const [unconfirmedOnly, setUnconfirmedOnly] = useState(true);
    const [surveysLoading, setSurveysLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(1);
    const [answers, setAnswers] = useState<AnswerInfo[]>([]);
    const router = useRouter();

    useEffect(() => {
        setSurveysLoading(true);
        AnswerApi.searchAnswerList(page,
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
                                    {/*<Select*/}
                                    {/*  limit={10}*/}
                                    {/*  data={surveys.map(data => data.title)}*/}
                                    {/*  clearable*/}
                                    {/*/>*/}
                                    {/* TODO: Surveys selection */}
                                    <Input
                                      value={surveySearch == null ? '' : surveySearch}
                                      onChange={(e) => setSurveySearch(e.target.value)} />
                                    <Checkbox
                                      defaultChecked
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
                        {/*<Input.Wrapper label="请输入 Answer ID 以跳转">*/}
                        {/*    <Input*/}
                        {/*      onChange={(e) => setAnswerId(parseInt(e.currentTarget.value, 10))}*/}
                        {/*    />*/}
                        {/*</Input.Wrapper>*/}
                        {/*<Center>*/}
                        {/*    <Button*/}
                        {/*      onClick={() => {*/}
                        {/*            router.push(`/backstage/judge/${answerId}`);*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        确认跳转至 {answerId}*/}
                        {/*    </Button>*/}
                        {/*</Center>*/}
                    </Stack>
                </Center>
            </Stack>
        </Center>

    );
}
