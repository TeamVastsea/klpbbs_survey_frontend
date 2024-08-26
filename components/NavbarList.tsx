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
    { link: '/tos', label: '条款' },
];

export function NavbarList() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [uid, setUid] = useState<string | undefined>(undefined);

    useEffect(() => {
        const status = Cookie.getCookie('status');
        if (status === 'ok') {
            const uid_ = Cookie.getCookie('uid');
            const username_ = decodeURIComponent(Cookie.getCookie('username') || '');
            setUid(uid_);
            setUsername(username_);
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

    const handleLogout = () => {
        Cookie.clearAllCookies();
        sessionStorage.setItem('logOutAndRedirect', 'true');
        window.location.reload();
    };
    
    useEffect(() => {
        if (sessionStorage.getItem('logOutAndRedirect') === 'true') {
            sessionStorage.removeItem('logOutAndRedirect');
            router.push('/oauth');
        }
    }, []);

    const items = links.map((link) => (
        <Button
          key={link.label}
          className={classes.link}
          onClick={() => handleClick(link.link)}
          onKeyDown={(e) => e.key === 'Enter' && handleClick(link.link)}
          tabIndex={0}
          aria-label={link.label}
          color="white"
        >
            {link.label}
        </Button>
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
