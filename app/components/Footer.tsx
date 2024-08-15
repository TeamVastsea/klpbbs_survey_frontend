import { Container, Group, Anchor } from '@mantine/core';
import classes from './Footer.module.css';

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
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <p>Logo Size 28</p>
          <p>&copy; 2024 BluBluBlu</p>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}