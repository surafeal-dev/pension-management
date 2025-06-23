import React, { useState } from 'react';
import {
  AppShell,
  Text,
  Group,
  Avatar,
  Box,
  Container,
  Title,
  Paper,
  Stack,
  rem,
  NavLink,
  SimpleGrid,
  Tabs,
} from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';
import DashboardOverview from './components/DashboardOverview';
import AssetAllocation from './components/AssetAllocation';
import PortfolioHoldings from './components/PortfolioHoldings';
import RecentTransactions from './components/RecentTransactions';
import ContributionHistory from './components/ContributionHistory';
import RetirementPlanning from './components/RetirementPlanning';

// SVG Icons with size prop
type IconProps = {
  size?: number | string;
  className?: string;
};

const MenuIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
  </svg>
);

const BellIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
  </svg>
);

const DashboardIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
  </svg>
);

const InvestmentsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.5 18.49L4.21 17.78L9 23V20H20V4H4V15H2V3C2 2.45 2.45 2 3 2H21C21.55 2 22 2.45 22 3V21C22 21.55 21.55 22 21 22H9.41L3.5 18.49Z" fill="currentColor"/>
  </svg>
);

const TransactionsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
  </svg>
);

const ReportsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
  </svg>
);

const SettingsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19.14 12.94C19.4 12.38 19.56 11.76 19.56 11.11C19.56 9.84 19.08 8.7 18.3 7.83L19.83 6.3C20.4 6.88 20.86 7.55 21.2 8.29C21.54 9.03 21.71 9.83 21.71 10.66C21.71 11.5 21.54 12.3 21.2 13.04C20.86 13.78 20.4 14.45 19.83 15.04L18.3 13.51C18.96 12.84 19.14 12.94 19.14 12.94ZM4.96 12.65L2.06 10.78C1.63 10.5 1.6 9.86 2 9.5L4.34 7.5C4.7 7.2 5.2 7.26 5.49 7.63L7.15 9.8C7.5 9.27 7.92 8.8 8.41 8.41L7.03 6.47C6.73 6.14 6.77 5.62 7.12 5.34L9.41 3.52C9.75 3.25 10.25 3.28 10.56 3.59L12.63 5.67C13.14 5.24 13.73 4.9 14.38 4.68V2.34C14.38 1.88 14.76 1.5 15.22 1.5H18.15C18.61 1.5 18.99 1.88 18.99 2.34V4.7C19.63 4.92 20.22 5.26 20.73 5.68L22.8 3.6C23.11 3.29 23.61 3.25 23.94 3.53L26.28 5.34C26.63 5.62 26.68 6.14 26.37 6.47L24.99 8.4C25.48 8.79 25.9 9.26 26.25 9.8L28.4 7.63C28.69 7.26 29.19 7.2 29.55 7.5L31.89 9.5C32.29 9.86 32.26 10.5 31.83 10.78L28.93 12.65C28.93 12.65 29.1 13.09 28.93 13.35L31.83 15.22C32.26 15.5 32.29 16.14 31.89 16.5L29.55 18.5C29.19 18.8 28.69 18.74 28.4 18.37L26.25 16.2C25.9 16.73 25.48 17.2 24.99 17.59L26.37 19.52C26.68 19.85 26.63 20.38 26.28 20.66L23.94 22.47C23.6 22.74 23.1 22.71 22.79 22.4L20.72 20.32C20.21 20.75 19.62 21.09 18.97 21.31V23.65C18.97 24.11 18.59 24.49 18.13 24.49H15.2C14.74 24.49 14.36 24.11 14.36 23.65V21.29C13.72 21.07 13.13 20.73 12.62 20.31L10.55 22.4C10.24 22.71 9.74 22.75 9.41 22.47L7.07 20.66C6.72 20.38 6.67 19.85 6.98 19.52L8.36 17.59C7.87 17.2 7.45 16.73 7.1 16.19L5.44 18.36C5.15 18.73 4.65 18.79 4.29 18.49L1.95 16.5C1.55 16.14 1.58 15.5 2.01 15.22L4.91 13.35C4.91 13.35 4.74 12.91 4.91 12.65L4.96 12.65ZM15.7 15.5C17.4 15.5 18.79 14.17 18.79 12.5C18.79 10.83 17.4 9.5 15.7 9.5C14 9.5 12.6 10.83 12.6 12.5C12.6 14.17 14 15.5 15.7 15.5Z" fill="currentColor"/>
  </svg>
);

const DemoPage = () => {
  const [opened, setOpened] = useState(false);
  
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Box style={{ cursor: 'pointer' }} onClick={() => setOpened(!opened)}>
              <MenuIcon />
            </Box>
            <Title order={4} fw={700}>
              Pension Management
            </Title>
          </Group>
          <Group>
            <Box style={{ cursor: 'pointer' }}>
              <BellIcon />
            </Box>
            <Avatar 
              src={null} 
              alt="User" 
              color="blue" 
              radius="xl"
            >
              JD
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={4}>
          <NavLink
            label="Dashboard"
            leftSection={<DashboardIcon />}
            variant="filled"
            active
            styles={{
              root: { 
                borderRadius: 'var(--mantine-radius-md)',
                '&[data-active]': {
                  backgroundColor: 'var(--mantine-primary-color-light)',
                  color: 'var(--mantine-primary-color-light-color)',
                },
                '&:hover': {
                  backgroundColor: 'var(--mantine-primary-color-light-hover)',
                },
              },
              label: { 
                fontWeight: 600,
                fontSize: 'var(--mantine-font-size-sm)',
              },
            }}
          />
          <NavLink 
            label="Investments" 
            leftSection={<InvestmentsIcon />}
            variant="subtle"
            styles={{
              root: { 
                borderRadius: 'var(--mantine-radius-md)',
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                },
              },
              label: { 
                fontWeight: 500,
                fontSize: 'var(--mantine-font-size-sm)',
              },
            }}
          />
          <NavLink 
            label="Transactions" 
            leftSection={<TransactionsIcon />}
            variant="subtle"
            styles={{
              root: { 
                borderRadius: 'var(--mantine-radius-md)',
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                },
              },
              label: { 
                fontWeight: 500,
                fontSize: 'var(--mantine-font-size-sm)',
              },
            }}
          />
          <NavLink 
            label="Reports" 
            leftSection={<ReportsIcon />}
            variant="subtle"
            styles={{
              root: { 
                borderRadius: 'var(--mantine-radius-md)',
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                },
              },
              label: { 
                fontWeight: 500,
                fontSize: 'var(--mantine-font-size-sm)',
              },
            }}
          />
          <Box mt="auto" pt="md">
            <NavLink 
              label="Settings" 
              leftSection={<SettingsIcon />}
              variant="subtle"
              styles={{
                root: { 
                  borderRadius: 'var(--mantine-radius-md)',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-gray-1)',
                  },
                },
                label: { 
                  fontWeight: 500,
                  fontSize: 'var(--mantine-font-size-sm)',
                },
              }}
            />
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg">
          <Stack gap="xl">
            <Box>
              <Title order={2} fw={700} mb="xs">Welcome back, John</Title>
              <Text c="dimmed" mb="md">Here's what's happening with your pension today</Text>
            </Box>
            
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview" leftSection={<DashboardIcon size={16} />}>
                  Overview
                </Tabs.Tab>
                <Tabs.Tab value="investments" leftSection={<InvestmentsIcon size={16} />}>
                  Investments
                </Tabs.Tab>
                <Tabs.Tab value="transactions" leftSection={<TransactionsIcon size={16} />}>
                  Transactions
                </Tabs.Tab>
                <Tabs.Tab value="planning" leftSection={<IconChartLine size={16} />}>
                  Planning
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Stack gap="xl">
                  <DashboardOverview />
                  
                  <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                    <AssetAllocation />
                    <Box>
                      <Title order={4} mb="md">Investment Distribution</Title>
                      <Text c="dimmed" size="sm">Your investments are diversified across different asset classes to balance risk and return.</Text>
                      <Text c="dimmed" size="sm" mt="md">
                        <Text component="span" fw={500}>Stocks</Text> provide growth potential but come with higher risk.
                      </Text>
                      <Text c="dimmed" size="sm">
                        <Text component="span" fw={500}>Bonds</Text> offer more stability and regular income.
                      </Text>
                      <Text c="dimmed" size="sm">
                        <Text component="span" fw={500}>Real Estate</Text> provides diversification and potential for appreciation.
                      </Text>
                    </Box>
                  </SimpleGrid>
                  
                  <PortfolioHoldings />
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="investments" pt="md">
                <Stack gap="md">
                  <Title order={3} mb="md">Investment Portfolio</Title>
                  <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                    <AssetAllocation />
                    <PortfolioHoldings />
                  </SimpleGrid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="transactions" pt="md">
                <Stack gap="md">
                  <ContributionHistory />
                  <RecentTransactions />
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="planning" pt="md">
                <RetirementPlanning />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default DemoPage;
