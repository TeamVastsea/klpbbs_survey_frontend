import React, { useEffect, useState } from 'react';
import { Burger, Container, Group, Image, Text, Menu, Button, Modal, Stack, Input } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle';
import classes from './Header.module.css';
import logo from '@/public/favicon.svg';
import { Cookie } from '@/components/cookie';
import UserApi from '@/api/UserApi';

interface Link {
    link: string;
    label: string;
}

const links: Link[] = [
    { link: '/', label: '首页' },
    { link: 'https://klpbbs.com', label: '主站' },
    { link: '/about', label: '关于' },
    { link: '/tos', label: '条款' },
];

export default function Header({ opened, toggle }: HeaderProps) {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [uid, setUid] = useState<string | undefined>(undefined);
    const [source, setSource] = useState<string>('');
    const [admin, setAdmin] = useState(false);
    const [logoutModalOpened, { open: logoutOpen, close: logoutClose }] = useDisclosure(false);
    const [changePasswordModalOpened, { open: changePasswordOpen, close: changePasswordClose }] = useDisclosure(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status === 'ok') {
            const uid_ = Cookie.getCookie('uid');
            const username_ = decodeURIComponent(Cookie.getCookie('username') || '');
            setUid(uid_);
            setUsername(username_);
            setAdmin(Cookie.getCookie('admin') === 'true');
            setSource(Cookie.getCookie('source'));
        } else {
            setUsername(null);
        }
    }, []);

    const handleClick = (link: string) => {
        if (link.startsWith('http')) {
            window.open(link, '_blank', 'noreferrer');
        } else {
            router.push(link);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('logOutAndRedirect') === 'true') {
            sessionStorage.removeItem('logOutAndRedirect');
            router.push('/oauth');
        }
    }, []);

    const changePassword = () => {
        setChanging(true);
        UserApi.changePassword(oldPassword, newPassword, uid === undefined ? '' : uid).then(() => {
            setChanging(false);
            changePasswordClose();
            Cookie.clearAllCookies();
            notifications.show({
                title: '密码修改成功',
                message: '请重新登录',
                color: 'green',
            });
            router.push('/oauth');
        })
            .catch(() => {
                setChanging(false);
            });
    };

    const userItems = username === null ? (
        <Button
          key="login"
          className={classes.loginButton}
          onClick={() => handleClick('/oauth')}
          aria-label="Login"
        >
            登录
        </Button>
    ) : (
        <Menu
          key="greeting"
          width={200}
          shadow="md"
          transitionProps={{
                transition: 'rotate-right',
                duration: 150,
            }}>
            <Menu.Target>
                <Button
                  className={classes.link}
                  tabIndex={0}
                  variant="subtle"
                >
                    你好, {username}
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>
                    用户名: {username}
                </Menu.Item>
                <Menu.Item>
                    UID: {uid}
                </Menu.Item>
                {source === 'Password' &&
                    <Menu.Item onClick={changePasswordOpen}>
                        更改密码
                    </Menu.Item>}
                {admin &&
                    <Menu.Item onClick={() => router.push('/backstage')}>
                      前往后台
                    </Menu.Item>
                }
                <Menu.Item
                  onClick={logoutOpen}
                  style={{ color: 'red' }}
                  aria-label="Logout"
                  role="button"
                  tabIndex={0}
                >
                    退出登录
                </Menu.Item>
            </Menu.Dropdown>
            <Modal opened={changePasswordModalOpened} onClose={changePasswordClose}>
                <Stack>
                    <Input.Wrapper label="旧密码">
                        <Input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)} />
                    </Input.Wrapper>

                    <Input.Wrapper label="新密码">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)} />
                    </Input.Wrapper>
                    <Button onClick={changePassword}>修改</Button>
                </Stack>
            </Modal>
            <Modal
              opened={logoutModalOpened}
              onClose={logoutClose}
              withCloseButton={false}
              centered>
                <Stack>
                    <Text>
                        是否要在所有设备上退出登录？
                    </Text>

                    <Group>
                        <Button onClick={() => {
                            Cookie.clearAllCookies();
                            sessionStorage.setItem('logOutAndRedirect', 'true');
                            window.location.reload();
                        }}>
                            仅在当前设备上退出登录
                        </Button>
                        <Button onClick={() => {
                            UserApi.invalidateToken(Cookie.getCookie('token')).then(() => {});
                            Cookie.clearAllCookies();
                            sessionStorage.setItem('logOutAndRedirect', 'true');
                            window.location.reload();
                        }}>
                            在所有设备上退出登录
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Menu>
    );

    return (
        <header
          className={classes.header}
          style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
            }}
        >
            <Container size="md" className={classes.inner}>
                <Group>
                    <Button
                      className={classes.link}
                      tabIndex={0}
                      variant="subtle"
                      leftSection={(<Image src={logo.src} w={28} h={28} />)}
                      onClick={() => router.push('/')}
                    >
                        <Text>苦力怕论坛 | 问卷系统</Text>
                    </Button>
                </Group>
                <Group gap={5} visibleFrom="xs">
                    {userItems}
                    {links.map((link) => (
                        <Button
                          key={link.label}
                          onClick={() => handleClick(link.link)}
                          onKeyDown={(e) => e.key === 'Enter' && handleClick(link.link)}
                          tabIndex={0}
                          aria-label={link.label}
                          className={classes.link}
                          variant="subtle"
                        >
                            {link.label}
                        </Button>
                    ))}
                    <ColorSchemeToggle />
                </Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Container>
        </header>
    );
}

export interface HeaderProps {
    opened: boolean;
    toggle: () => void;
}
