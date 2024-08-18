import React, { useEffect, useState } from 'react';
import { Group, Space, Stack, Menu, Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from '@/components/Header.module.css';
import { Cookie } from '@/components/cookie';

interface Link {
    link: string;
    label: string;
}

const links: Link[] = [
    { link: '/', label: '首页' },
    { link: 'https://klpbbs.com', label: '主站' },
    { link: '/about', label: '关于' },
];

export function NavbarList() {
    const router = useRouter();
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [uid, setUid] = useState<string | undefined>(undefined);

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status === 'ok') {
            const uid_ = Cookie.getCookie('uid');
            const username_ = decodeURIComponent(Cookie.getCookie('username') || '');
            setUid(uid_);
            setUsername(username_);
        } else {
            setUsername('null');
        }
    }, []);

    const handleLogout = () => {
        Cookie.clearCookie('uid');
        Cookie.clearCookie('username');
        window.location.reload();
    };

    const items = links.map((link) => (
        <a
          key={link.label}
          href={link.link}
          className={classes.link}
          onClick={() => router.push(link.link)}
          target={link.link.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
        >
            {link.label}
        </a>
    ));

    return (
        <Group>
            <Space w={10} />
            <Stack>
                <Space w={10} />
                {username ? (
                    <Menu
                      shadow="md"
                      width={200}
                      position="right-start"
                    >
                        <Menu.Target>
                            <Text
                              className={classes.link}
                              role="button"
                              tabIndex={0}
                              aria-label={`你好, ${username}`}
                              inherit
                            >
                                你好, {username}
                            </Text>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                用户名: {username}
                            </Menu.Item>
                            <Menu.Item>
                                UID: {uid}
                            </Menu.Item>
                            <Menu.Item
                              onClick={handleLogout}
                              style={{ color: 'red' }}
                              aria-label="Logout"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                            >
                                退出登录
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <Button
                      className={classes.loginButton}
                      onClick={() => router.push('/oauth')}
                      aria-label="Login"
                    >
                        登录
                    </Button>
                )}
                {items}
            </Stack>
        </Group>
    );
}
