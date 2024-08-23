import { Button, Group, Collapse, Box, Menu, Center, Stack, Space, Tooltip } from '@mantine/core';
import { IconCategory2, IconHome, IconLogout } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Cookie } from '@/components/cookie';

export default function Tools() {
    const [opened, { toggle }] = useDisclosure(false);

    function goHome() {
        window.location.href = '/';
    }

    function logOut() {
        Cookie.clearAllCookies();
        goHome();
    }

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
            <Collapse in={opened} style={{ transformOrigin: 'bottom center' }}>
                <Menu shadow="md" withArrow position="top">
                    <Stack>
                        <Menu.Item>
                            <Center>
                                <Tooltip label="回到首页" zIndex={1200}>
                                    <IconHome onClick={goHome} style={{ cursor: 'pointer' }} />
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
