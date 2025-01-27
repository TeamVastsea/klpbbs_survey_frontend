import React, {useEffect} from 'react';
import {Avatar, Button, Group, Space, Stack, Text} from '@mantine/core';
import {useRouter} from 'next/navigation';
import classes from '@/app/components/Header.module.css';
import {ColorSchemeToggle} from "@/components/ColorSchemeToggle";
import {useUser} from "@/data/use-user";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

interface Link {
  link: string;
  label: string;
}

const links: Link[] = [
  {link: '/', label: '首页'},
  {link: 'https://klpbbs.com', label: '主站'},
  {link: '/about', label: '关于'},
  {link: '/tos', label: '条款'},
];

export function NavbarList() {
  const router = useRouter();
  const user = useUser();
  const id_str = user.user?.uid.padStart(9, '0');
  const avatar_url = `https://user.klpbbs.com/data/avatar/${id_str?.substring(0, 3)}/${id_str?.substring(3, 5)}/${id_str?.substring(5, 7)}/${id_str?.substring(7, 9)}_avatar_big.jpg`;


  useEffect(() => {
  }, []);

  const handleClick = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noreferrer');
    } else {
      router.push(link);
    }
  };

  const handleLogout = () => {
    modals.openConfirmModal({
      title: '是否要在所有设备上退出登录？',
      children: (
        <Text size="sm">
          退出后，您需要重新登录。如果您的账户在多个设备上登录，您可以选择退出所有设备或仅退出当前设备。如果您在公共设备上登录，请务必退出所有设备。
        </Text>
      ),
      labels: { confirm: '退出所有设备', cancel: '退出当前设备' },
      onCancel: () => {
        notifications.show({ title: '退出成功', message: '您已经退出登录', color: 'teal' });
      },
      onConfirm: () => {
        notifications.show({ title: '退出成功', message: '您已经退出所有登录', color: 'teal' });
      },
    });
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
      variant="subtle"
    >
      {link.label}
    </Button>
  ));

  return (
    <Group>
      <Space w={10}/>
      <Stack align="flex-start">
        <Space w={10}/>
        {user.isLoggedIn ?
          <Stack align="flex-start">
            <Avatar size="lg" src={avatar_url} alt={user.user?.username}/>
            <Text>{`${user.user?.username}(${user.user?.uid})`}</Text>
            <Button onClick={handleLogout}>退出登录</Button>
          </Stack> :
          <Button
            key="login"
            className={classes.loginButton}
            onClick={() => handleClick('/oauth')}
            aria-label="Login"
          >
            登录
          </Button>}
        {user.isLoggedIn && user.user?.admin && (
          <Button
            key="admin"
            onClick={() => handleClick('/admin')}
            aria-label="Admin"
            className={classes.link}
            variant="subtle"
          >
            前往后台
          </Button>
        )}
        {items}
        {/*<Center>*/}
        <ColorSchemeToggle/>
        {/*</Center>*/}
      </Stack>
    </Group>
  );
}
