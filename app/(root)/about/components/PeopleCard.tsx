import { Avatar, Badge, Button, Group, Stack, Title } from '@mantine/core';
import { useState, useEffect } from 'react';

interface DeveloperCardProps {
    name: string;
    badges?: string[];
    links: { name: string; url: string }[];
    logo: string;
}

export default function PeopleCard({
                                       name,
                                       badges = [],
                                       links,
                                       logo,
                                   }: DeveloperCardProps) {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 430);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth <= 430);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Group
          style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                alignItems: isSmallScreen ? 'center' : 'flex-start',
                justifyContent: isSmallScreen ? 'center' : 'flex-start',
                textAlign: isSmallScreen ? 'center' : 'left',
            }}
        >
            <Avatar
              src={logo}
              alt={name}
              size="8rem"
              style={{
                    marginBottom: isSmallScreen ? '1rem' : 'initial',
                    marginLeft: isSmallScreen ? 'auto' : 'initial',
                    marginRight: isSmallScreen ? 'auto' : 'initial',
                }}
            />
            <Stack>
                <Title order={3}>{name}</Title>
                <Group
                  style={{
                        justifyContent: isSmallScreen ? 'center' : 'flex-start',
                        marginBottom: '1rem',
                    }}
                >
                    {badges.map((badge, idx) => (
                        <Badge key={idx}>{badge}</Badge>
                    ))}
                </Group>
                <Group
                  style={{
                        justifyContent: isSmallScreen ? 'center' : 'flex-start',
                    }}
                >
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
