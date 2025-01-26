import React, {useEffect} from 'react';
import {Avatar, Button, Center, Group, Popover, Space, Stack, Text} from '@mantine/core';
import {useRouter} from 'next/navigation';
import classes from '@/app/components/Header.module.css';
import {ColorSchemeToggle} from "@/components/ColorSchemeToggle";
import useUser from "@/data/use-user";

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
          <Popover>
            <Popover.Target>
              <Button
                className={classes.link}
                variant="subtle"
              >
                您好，{user.user?.username}
              </Button>
            </Popover.Target>

            <Popover.Dropdown>
              <Stack align="center">
                <Avatar size="lg" src={avatar_url} alt={user.user?.username}/>
                <Text>{`${user.user?.username}(${user.user?.uid})`}</Text>
                <Button onClick={handleLogout}>退出</Button>
              </Stack>
            </Popover.Dropdown>
          </Popover> :
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
