import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import DemoPage from './DemoPage'; // Import the new DemoPage

// Create a custom theme
const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  primaryColor: 'blue',
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <DemoPage />
    </MantineProvider>
  );
}

export default App;
