import { Avatar, Badge, Button, Group, Stack, Text, Title } from '@mantine/core';

interface DeveloperCardProps {
    name: string;
    badge: string;
    description: string;
    links: { name: string; url: string }[];
    logo: string;
}

export default function DeveloperCard({
                                          name,
                                          badge,
                                          description,
                                          links,
                                          logo,
                                      }: DeveloperCardProps) {
    return (
        <Group>
            <Avatar src={logo} alt={name} size="8rem" />
            <Stack>
                <Title order={3}>{name}</Title>
                <Badge>{badge}</Badge>
                <Text>{description}</Text>
                <Group>
                    {links.map((link, idx) => (
                        <Button
                          key={idx}
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
