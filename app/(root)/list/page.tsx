'use client';

import { Center, Space, Stack, Table, Title } from '@mantine/core';
import React from 'react';
import surveyData from './data/surveys.json';
import listStyle from './list.module.css';

export default function SurveyList() {
    const rows = surveyData.map((survey) => (
        <Table.Tr key={survey.id}>
            <Table.Td className={listStyle.list}>{survey.id}</Table.Td>
            <Table.Td className={listStyle.list}>{survey.title}</Table.Td>
            <Table.Td
              className={listStyle.list}
              style={{
                    maxWidth: '200px',
                    wordWrap: 'break-word',
                    flexGrow: 1, // Allow this column to grow and shrink
                }}
            >
                {survey.description}
            </Table.Td>
            <Table.Td className={listStyle.list}>
                {new Date(survey.start_date).toLocaleDateString()}
            </Table.Td>
            <Table.Td
              style={{
                    width: '70px',
                    minWidth: '70px', // Ensure this column doesn't shrink below 70px
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
                            <Table.Th className={listStyle.list}>起始时间</Table.Th>
                            <Table.Th
                              style={{
                                    width: '70px',
                                    minWidth: '70px', // Fixed width and minWidth
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
