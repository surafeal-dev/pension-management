import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/styles.css";

import { MantineProvider } from "@mantine/core";
import ContributionsLayout from "./contribution-layout";


export function App() {
  return (
    <MantineProvider >
      <ContributionsLayout />
    </MantineProvider>
  );
}

export default App;