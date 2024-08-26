import { Center, Stack, Text } from '@mantine/core';
import { ScratchCard } from 'scratch-card-react';
import { useEffect, useRef, useState } from 'react';
import { ScratchCardRef } from 'scratch-card-react/dist/scratch-card';

const items = ['iPhone 12', 'iPad Pro', 'MacBook Pro', 'AirPods Pro', 'Apple Watch', 'Apple Pencil'];

interface ScratchProps {
    onScratchComplete: () => void;
}

export default function Scratch({ onScratchComplete }: ScratchProps) {
    const cardRef = useRef<ScratchCardRef>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [item, setItem] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
            const randomItem = items[Math.floor(Math.random() * items.length)];
            setItem(randomItem);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Stack>
                <div style={{ position: 'relative', width: 300, height: 200 }}>
                    <div
                      style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: -1,
                            opacity: isLoaded ? 1 : 0,
                        }}
                    >
                        <Stack c="indigo">
                            <Center>
                                <Text>恭喜你中奖了!</Text>
                            </Center>
                            <Center>
                                <Text>奖品: {item}</Text>
                            </Center>
                            <Center>
                                <Text size="10px" c="gray">0.01 元代金券</Text>
                            </Center>
                        </Stack>
                    </div>

                    {/* Scratch card area */}
                    <ScratchCard
                      ref={cardRef}
                      width={300}
                      height={200}
                      coverColor="#f0f0f0"
                      callbackInfo={{
                            radio: 0.7,
                            calllback: () => {
                                cardRef.current?.clearCard();
                                onScratchComplete();
                            },
                        }}
                    />
                </div>
            </Stack>
        </>
    );
}
