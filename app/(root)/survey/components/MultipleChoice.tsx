import { Checkbox, Group, Stack, Text } from '@mantine/core';
import classes from './MultipleChoice.module.css';
import { ChoiceProps } from './SingleChoice';

export function MultipleChoice(props: ChoiceProps) {
    const data = props.choice;

    // console.log(props.value);

    function setValue(value: string[]) {
        // console.log(JSON.stringify(value));
        props.setValue(JSON.stringify(value));
    }
    
    const getCardColor = (index: number) => {
        if (!props.correctAnswer || !props.disabled) return undefined;
        
        const userSelectedArray = props.value === undefined || props.value === '' ? [] : JSON.parse(props.value);
        const correctArray = JSON.parse(props.correctAnswer);
        
        const userSelected = userSelectedArray.includes(index.toString());
        const isCorrect = correctArray.includes(index.toString());
        
        if (userSelected && !isCorrect) return 'rgba(255, 0, 0, 0.1)'; // 红色 - 用户选择但错误
        if (userSelected && isCorrect) return 'rgba(0, 0, 255, 0.1)'; // 蓝色 - 用户选择且正确
        if (!userSelected && isCorrect) return 'rgba(0, 255, 0, 0.1)'; // 绿色 - 用户未选择但正确
        
        return undefined;
    };

    const cards = data.map(({ title, content }, index) => (
        <Checkbox.Card 
            className={classes.root} 
            radius="md" 
            value={index.toString()} 
            key={index} 
            disabled={props.disabled}
            style={{ backgroundColor: getCardColor(index) }}
        >
            <Group wrap="nowrap" align="flex-start">
                <Checkbox.Indicator />
                <div>
                    <Text className={classes.label}>{title}</Text>
                    <Text className={classes.description}>{content}</Text>
                </div>
            </Group>
        </Checkbox.Card>
    ));

    return (
        <>
            <Checkbox.Group
              value={props.value === undefined || props.value === '' ? [] : JSON.parse(props.value)}
              onChange={setValue}
            >
                <Stack pt="md" gap="xs">
                    {cards}
                </Stack>
            </Checkbox.Group>

            {/*<Text fz="xs" mt="md">*/}
            {/*    CurrentValue: {value.join(', ') || '–'}*/}
            {/*</Text>*/}
        </>
    );
}
