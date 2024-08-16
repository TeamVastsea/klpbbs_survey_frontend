import { Avatar, Badge, Button, Group, Stack, Title } from '@mantine/core';

interface DeveloperCardProps {
    name: string;
    badges?: string[];
    links: { name: string; url: string }[];
    logo: string;
}

export default function DeveloperCard({
                                          name,
                                          badges = [], // Provide a default empty array if badges is undefined
                                          links,
                                          logo,
                                      }: DeveloperCardProps) {
    return (
        <Group>
            <Avatar src={logo} alt={name} size="8rem" />
            <Stack>
                <Title order={3}>{name}</Title>
                <Group>
                    {badges.map((badge, idx) => (
                        <Badge key={idx}>{badge}</Badge>
                    ))}
                </Group>
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
