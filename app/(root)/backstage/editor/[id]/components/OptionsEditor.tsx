import { Button, Card, Input, Modal, Stack } from '@mantine/core';
import { Value } from '@/app/(root)/survey/components/generateQuestion';

export default function OptionsEditor(props: OptionsEditorProps) {
    return (
        <Modal opened={props.opened} onClose={props.close} title="选项编辑器">
            <Stack>{props.options.map((option, index) => (
                <Card withBorder>
                    <Stack>
                        <Input
                          value={option.title}
                          onChange={e => {
                                const newOptions = [...props.options];
                                newOptions[index].title = e.currentTarget.value;
                                props.setOptions(newOptions);
                            }} />
                        <Input
                          value={option.content}
                          onChange={e => {
                                const newOptions = [...props.options];
                                newOptions[index].content = e.currentTarget.value;
                                props.setOptions(newOptions);
                            }} />
                    </Stack>
                </Card>
            ))}
                <Button.Group>
                    <Button onClick={() => props.setOptions([])} color="red" variant="outline">重置</Button>
                    <Button onClick={() => {
                            const newOptions = [...props.options];
                            newOptions.push({ title: '', content: '' });
                            props.setOptions(newOptions);
                    }}>
                        增加选项
                    </Button>
                </Button.Group>
            </Stack>
        </Modal>
    );
}

export interface OptionsEditorProps {
    options: Value[];
    setOptions: (value: Value[]) => void;
    opened: boolean;
    close: () => void;
}
