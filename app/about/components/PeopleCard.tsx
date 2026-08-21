import { Avatar, Badge, Button, Group, Stack, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export interface Person {
  name: string;
  badges: string[];
  links: { name: string; url: string }[];
  logo: string;
}

export default function PeopleCard({ name, badges, links, logo }: Person) {
  const smallScreen = useMediaQuery('(max-width: 430px)');

  return (
    <Group
      align={smallScreen ? 'center' : 'flex-start'}
      justify={smallScreen ? 'center' : 'flex-start'}
    >
      <Avatar src={logo} alt={name} size="8rem" />
      <Stack align={smallScreen ? 'center' : 'flex-start'}>
        <Title order={3}>{name}</Title>
        <Group justify={smallScreen ? 'center' : 'flex-start'}>
          {badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </Group>
        <Group justify={smallScreen ? 'center' : 'flex-start'}>
          {links.map((link) => (
            <Button
              key={link.url}
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
            >
              {link.name}
            </Button>
          ))}
        </Group>
      </Stack>
    </Group>
  );
}
