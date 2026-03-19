import React from 'react';
import {
    Paper, Title, Text, Code, Alert, Divider,
    Badge, Group, Stack, Box, ScrollArea
} from '@mantine/core';
import { IconAlertCircle, IconBulb, IconTerminal2, IconInfoCircle } from '@tabler/icons-react';

export default function ResponseDisplay({ response }) {
    if (!response) return null;

    if (!response.success) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error" radius="md">
                {response.error}
            </Alert>
        );
    }

    const { result, explanation, mongoQuery } = response.data;

    return (
        <Stack gap="md">
            <Paper shadow="sm" p="lg" withBorder radius="md">
                <Group mb="sm" gap="xs">
                    <IconInfoCircle size={18} color="var(--mantine-color-indigo-6)" />
                    <Title order={5}>Resumen</Title>
                </Group>
                <Text>{result.summary}</Text>
            </Paper>

            {result.data && (
                <Paper shadow="sm" p="lg" withBorder radius="md">
                    <Group mb="sm" gap="xs">
                        <IconTerminal2 size={18} color="var(--mantine-color-violet-6)" />
                        <Title order={5}>Datos</Title>
                    </Group>
                    <ScrollArea>
                        <Code block style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>
                            {result.data}
                        </Code>
                    </ScrollArea>
                </Paper>
            )}

            {result.insights && (
                <Alert icon={<IconBulb size={16} />} color="yellow" title="Insights" radius="md">
                    {result.insights}
                </Alert>
            )}

            <Paper shadow="xs" p="md" withBorder radius="md" bg="gray.0">
                <Divider mb="sm" label={<Badge variant="light" size="sm">Detalles técnicos</Badge>} />
                <Stack gap="xs">
                    <Box>
                        <Text size="xs" fw={600} c="dimmed" mb={4}>Consulta MongoDB</Text>
                        <Code block style={{ fontSize: 12 }}>
                            {JSON.stringify(mongoQuery, null, 2)}
                        </Code>
                    </Box>
                    <Box>
                        <Text size="xs" fw={600} c="dimmed" mb={4}>Explicación</Text>
                        <Text size="sm">{explanation}</Text>
                    </Box>
                </Stack>
            </Paper>
        </Stack>
    );
}