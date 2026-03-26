import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // <- No .tsx extension needed
import { ThemeProvider } from 'next-themes'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Failed to find the root element. The app can't be mounted.")
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>
)
