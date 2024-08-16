import { Container, Group, Anchor, Image } from '@mantine/core';
import classes from './Footer.module.css';
import logo from '@/public/favicon.svg';

const links = [
  { link: '/about', label: '关于我们' },
];

export default function Footer() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  const year = new Date().getFullYear();

  return (
    <div>
        <Container className={classes.inner}>
          <Image src={logo.src} w={35} h={35} />
          <p>
            &copy; {year}&nbsp;
            <a href="https://github.com/TeamVastsea" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              瀚海工艺
            </a>
            &nbsp;|&nbsp;
            <a href="https://klpbbs.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              苦力怕论坛
            </a>
          </p>
          <Group className={classes.links}>{items}</Group>
        </Container>
    </div>
  );
}
