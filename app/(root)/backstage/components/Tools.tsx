import { Box, Button, Center, Collapse, Group, Menu, Modal, Space, Stack, Tooltip, Text } from '@mantine/core';
import { IconCategory2, IconHome, IconSettings, IconLogout } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Cookie } from '@/components/cookie';

export default function Tools() {
    const [opened, { toggle }] = useDisclosure(false);
    const [openedModal, { open, close }] = useDisclosure(false);
    const [actionType, setActionType] = useState<'home' | 'backstage' | null>(null);

    function goHome() {
        window.location.href = '/';
    }

    function goBackstage() {
        window.location.href = '/backstage';
    }

    function logOut() {
        Cookie.clearAllCookies();
        sessionStorage.setItem('logOutAndRedirect', 'true');
        window.location.reload();
    }

    const openConfirmationModal = (action: 'home' | 'backstage') => {
        setActionType(action);
        open();
    };

    const handleConfirm = () => {
        if (actionType === 'home') {
            goHome();
        } else if (actionType === 'backstage') {
            goBackstage();
        }
        close();
    };

    return (
        <Box
          maw={50}
          style={{
                zIndex: 1000,
                position: 'fixed',
                bottom: '40px',
                right: '40px',
            }}
        >
            <Modal opened={openedModal} onClose={close} title="确认操作">
                <Text>您确定要执行此操作吗？如果您正在编辑或批改问卷，建议先保存您的进度，以免丢失重要的修改内容。确保一切都已妥当后再继续操作哦！</Text>
                <Group position="center" mt="md" w="100%">
                    <Button color="blue" onClick={handleConfirm}>是</Button>
                    <Button color="red" onClick={close}>否</Button>
                </Group>
            </Modal>

            <Collapse in={opened} style={{ transformOrigin: 'bottom center' }}>
                <Menu shadow="md" withArrow position="top">
                    <Stack>
                        <Menu.Item>
                            <Center>
                                <Tooltip label="回到首页" zIndex={1200}>
                                    <IconHome
                                      onClick={() => openConfirmationModal('home')}
                                      style={{ cursor: 'pointer' }}
                                    />
                                </Tooltip>
                            </Center>
                        </Menu.Item>
                        <Menu.Item>
                            <Center>
                                <Tooltip label="回到后台首页" zIndex={1200}>
                                    <IconSettings
                                      onClick={() => openConfirmationModal('backstage')}
                                      style={{ cursor: 'pointer' }}
                                    />
                                </Tooltip>
                            </Center>
                        </Menu.Item>
                        <Menu.Item>
                            <Center>
                                <Tooltip label="退出登录" zIndex={1200}>
                                    <IconLogout onClick={logOut} style={{ cursor: 'pointer' }} />
                                </Tooltip>
                            </Center>
                        </Menu.Item>
                    </Stack>
                </Menu>
            </Collapse>

            <Space h={10} />

            <Group justify="center" mb={5}>
                <Button
                  onClick={toggle}
                  style={{
                        borderRadius: '50%',
                        height: '50px',
                        width: '50px',
                    }}
                >
                    <IconCategory2 />
                </Button>
            </Group>
        </Box>
    );
}
