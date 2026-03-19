import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'
import App from './App.jsx'

const theme = createTheme({
    primaryColor: 'indigo',
    fontFamily: 'Inter, sans-serif',
    defaultRadius: 'md',
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="light">
            <App />
        </MantineProvider>
    </StrictMode>,
)