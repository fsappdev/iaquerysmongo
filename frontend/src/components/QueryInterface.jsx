import React, { useState } from 'react';
import { TextInput, Button, Group, Paper } from '@mantine/core';
import { IconSearch, IconLoader2 } from '@tabler/icons-react';
import { sendNaturalQuery } from '../services/api';

export default function QueryInterface({ onResponse }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        const response = await sendNaturalQuery(query);
        console.log("response 📽️ 📊 ", response);
        onResponse(response);
        setLoading(false);
    };

    return (
        <Paper shadow="sm" p="lg" mb="lg" withBorder>
            <form onSubmit={handleSubmit}>
                <Group gap="sm" align="flex-end">
                    <TextInput
                        flex={1}
                        size="md"
                        placeholder="Ej: ¿Cuántos usuarios se registraron este mes?"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        leftSection={<IconSearch size={16} />}
                        required
                    />
                    <Button
                        type="submit"
                        size="md"
                        loading={loading}
                        leftSection={!loading ? <IconSearch size={16} /> : <IconLoader2 size={16} />}
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet' }}
                    >
                        {loading ? 'Consultando...' : 'Consultar'}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}