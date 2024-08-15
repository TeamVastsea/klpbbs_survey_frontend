import { Container, Group, Anchor, Image, Center } from '@mantine/core';
import classes from './Footer.module.css';
import logo from '@/public/favicon.svg';

const links = [
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
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

  return (
    <div>
        <Container className={classes.inner}>
          <Image src={logo.src} w={35} h={35} />
          <p>&copy; 2024 BluBluBlu</p>
          <Group className={classes.links}>{items}</Group>
        </Container>
    </div>
  );
}
