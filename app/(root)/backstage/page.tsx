'use client';

import {
    Grid,
    SimpleGrid,
} from '@mantine/core';
import NavBar from './components/NavBar';
import BadgeCard from './components/BadgeCard';
import './Style.css';

export default function BackStage() {
    return (
        <>
            <Grid>
                <Grid.Col span={3}>
                    <NavBar />
                </Grid.Col>
                <Grid.Col span={9}>
                    <SimpleGrid cols={5} spacing="sm" id="contents">
                        <BadgeCard />
                    </SimpleGrid>
                </Grid.Col>
            </Grid>
        </>
    );
}
