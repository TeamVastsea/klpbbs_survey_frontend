import {
    ActionIcon,
    Button,
    Card, Center,
    Checkbox,
    Group,
    Input,
    Menu,
    Modal,
    ScrollArea,
    Stack,
    Text,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Value } from '@/api/QuestionApi';
import classes from '@/app/(root)/survey/components/MultipleChoice.module.css';

export default function OptionsEditor(props: OptionsEditorProps) {
    return (
        <Modal
          opened={props.opened}
          onClose={props.close}
          title="选项编辑器"
          centered
          size="lg"
        >
            <Stack>
                <Card withBorder>
                    <Stack>
                        <Text>示例</Text>
                        <Checkbox.Card
                          className={classes.root}
                          radius="md"
                          key={0}
                          checked>
                            <Group wrap="nowrap" align="flex-start">
                                <Checkbox.Indicator />
                                <div>
                                    <Text className={classes.label}>选项标题</Text>
                                    <Text className={classes.description}>选项内容</Text>
                                </div>
                            </Group>
                        </Checkbox.Card>
                    </Stack>
                </Card>
                <ScrollArea h={350} type="auto">
                    <Stack>
                        {props.options.map((option, index) => (
                            <Card withBorder key={index}>
                                <Stack style={{ position: 'relative' }}>
                                    <Group justify="space-between">
                                        <Text>
                                            选项 {index + 1}
                                        </Text>
                                        <ActionIcon
                                          size="xs"
                                          color="red"
                                          onClick={() => {
                                                const newOptions = [...props.options];
                                                newOptions.splice(index, 1);
                                                props.setOptions(newOptions);
                                            }}>
                                            <IconX />
                                        </ActionIcon>
                                    </Group>
                                    <Input
                                      value={option.title}
                                      placeholder="题目"
                                      onChange={(e) => {
                                            const newOptions = [...props.options];
                                            newOptions[index].title = e.currentTarget.value;
                                            props.setOptions(newOptions);
                                        }}
                                    />
                                    <Input
                                      value={option.content}
                                      placeholder="内容"
                                      onChange={(e) => {
                                            const newOptions = [...props.options];
                                            newOptions[index].content = e.currentTarget.value;
                                            props.setOptions(newOptions);
                                        }}
                                    />
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </ScrollArea>
                <Group justify="end">
                    <Menu>
                        <Menu.Target>
                            <Button color="red" variant="outline">
                                清空
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>
                                确认删除吗? 该操作不可撤销
                            </Menu.Label>
                            <Menu.Item color="red" onClick={() => props.setOptions([])}>
                                <Center>
                                    确认清空
                                </Center>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Button
                      onClick={() => {
                            const newOptions = [...props.options];
                            newOptions.push({ title: '', content: '' });
                            props.setOptions(newOptions);
                        }}
                    >
                        增加选项
                    </Button>
                </Group>
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
