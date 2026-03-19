import React, { useState } from 'react';
import { AppShell, Container, Title, Text, Group, Box } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import QueryInterface from './components/QueryInterface';
import ResponseDisplay from './components/ResponseDisplay';

function App() {
    const [response, setResponse] = useState(null);

    return (
        <AppShell header={{ height: 64 }} padding="md">
            <AppShell.Header>
                <Container size="lg" h="100%">
                    <Group h="100%" gap="sm">
                        <Box
                            style={{
                                background: 'linear-gradient(135deg, #4c6ef5, #7c3aed)',
                                borderRadius: 8,
                                padding: '6px 8px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <IconDatabase size={20} color="white" />
                        </Box>
                        <div>
                            <Title order={4} style={{ lineHeight: 1.2 }}>QueryAI</Title>
                            <Text size="xs" c="dimmed">Consultas inteligentes a MongoDB</Text>
                        </div>
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Main>
                <Container size="lg" py="xl">
                    <Box mb="xl" ta="center">
                        <Title order={2} mb="xs">Consulta tu Base de Datos</Title>
                        <Text c="dimmed" size="sm">
                            Escribe en lenguaje natural y obtén resultados al instante
                        </Text>
                    </Box>
                    <QueryInterface onResponse={setResponse} />
                    <ResponseDisplay response={response} />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}

export default App;