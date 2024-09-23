'use client';

import { Center, SimpleGrid, Space, Stack, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { min } from '@floating-ui/utils';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import SurveyApi, { SurveyInfo } from '@/api/SurveyApi';
import BadgeCard from '@/app/(root)/backstage/components/BadgeCard';
import { Cookie } from '@/components/cookie';

export default function SurveyList() {
    const [surveys, setSurveys] = useState<SurveyInfo[]>([]);
    const router = useRouter();

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status !== 'ok') {
            router.push('/oauth');
            return;
        }

        SurveyApi.getList(0, 10, '')
            .then(r => setSurveys(r))
            .catch(e => {
                notifications.show({
                    title: '获取问卷列表失败, 请将以下信息反馈给管理员',
                    message: e.toString(),
                    color: 'red',
                });
            });
    }, []);

    return (
        <Center>
            <Stack>
                <Space h="lg" />
                <Center>
                    <Title>问卷列表</Title>
                </Center>
                <SimpleGrid
                  cols={{
                        base: 1,
                        sm: min(2, surveys.length),
                        lg: min(3, surveys.length),
                    }}>
                    {surveys.map((survey: SurveyInfo, index: number) => (
                        <BadgeCard key={index} survey={survey} routeAdmin={false} />
                    ))}
                </SimpleGrid>
            </Stack>
        </Center>
    );
}
