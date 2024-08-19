'use client';

import { Center, Space, Stack, Table, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import surveyData from './data/surveys.json';
import listStyle from './list.module.css';
import { Cookie } from '@/components/cookie';

export default function SurveyList() {
    const router = useRouter();

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status === 'ok') { /* empty */ } else {
            router.push('/oauth');
        }
    }, []);

    const rows = surveyData.map((survey) => (
        <Table.Tr key={survey.id}>
            <Table.Td className={listStyle.list}>{survey.id}</Table.Td>
            <Table.Td className={listStyle.list}>{survey.title}</Table.Td>
            <Table.Td
              className={listStyle.list}
              style={{
                    maxWidth: '200px',
                    wordWrap: 'break-word',
                    flexGrow: 1,
                }}
            >
                {survey.description}
            </Table.Td>
            <Table.Td
              style={{
                    width: '70px',
                    minWidth: '70px',
                    textAlign: 'center',
                }}
              className={listStyle.list}
            >
                <a href="#">跳转</a>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Center>
            <Stack>
                <Space h="lg" />
                <Center>
                    <Title>问卷列表</Title>
                </Center>
                <Table
                  style={{
                        minWidth: 350,
                        maxWidth: 450,
                    }}
                  horizontalSpacing="md"
                  striped
                  highlightOnHover
                  withRowBorders={false}
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={listStyle.list}>ID</Table.Th>
                            <Table.Th className={listStyle.list}>标题</Table.Th>
                            <Table.Th className={listStyle.list}>描述</Table.Th>
                            <Table.Th
                              style={{
                                    width: '70px',
                                    minWidth: '70px',
                                    textAlign: 'center',
                                }}
                              className={listStyle.list}
                            >
                                操作
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Stack>
        </Center>
    );
}
