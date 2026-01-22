import { Group, Radio, Stack, Text } from '@mantine/core';
import classes from './SingleChoice.module.css';
import type { InputProps } from './generateQuestion';
import type { Value } from '@/api/QuestionApi';

export function SingleChoice(props: ChoiceProps) {
    const data = props.choice;
    
    const getCardColor = (index: number) => {
        if (!props.correctAnswer || !props.disabled) return undefined;
        
        const userSelected = props.value === index.toString();
        const isCorrect = props.correctAnswer === index.toString();
        
        if (userSelected && !isCorrect) return 'rgba(255, 0, 0, 0.1)'; // 红色 - 用户选择但错误
        if (userSelected && isCorrect) return 'rgba(0, 0, 255, 0.1)'; // 蓝色 - 用户选择且正确
        if (!userSelected && isCorrect) return 'rgba(0, 255, 0, 0.1)'; // 绿色 - 用户未选择但正确
        
        return undefined;
    };

    const cards = data.map(({ title, content }, index) => (
        <Radio.Card 
            className={classes.root} 
            radius="md" 
            value={index.toString()} 
            key={index} 
            disabled={props.disabled}
            style={{ backgroundColor: getCardColor(index) }}
        >
            <Group wrap="nowrap" align="flex-start">
                <Radio.Indicator />
                <div>
                    <Text className={classes.label}>{title}</Text>
                    <Text className={classes.description}>{content}</Text>
                </div>
            </Group>
        </Radio.Card>
    ));

    return (
        <>
            <Radio.Group
              value={props.value}
              onChange={props.setValue}
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Radio.Group>
        </>
    );
}

export interface ChoiceProps extends InputProps {
    choice: Value[];
    correctAnswer?: string;
}
