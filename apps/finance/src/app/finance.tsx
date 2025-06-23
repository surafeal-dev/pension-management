"use client";

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Tabs,
  Table,
  Group,
  Progress,
  Paper,
  rem,
  TextInput,
  Select,
  Box,
  Flex,
  Stack,
} from '@mantine/core';
import { AreaChart, PieChart } from '@mantine/charts';

// SVG Icons
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
  </svg>
);

const PiggyBankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 8H18V7C18 6.45 17.55 6 17 6C16.45 6 16 6.45 16 7V8H8C6.9 8 6 8.9 6 10V14C6 15.1 6.9 16 8 16H9V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V16H16C17.1 16 18 15.1 18 14V10C18 8.9 17.1 8 16 8H12V7C12 6.45 11.55 6 11 6C10.45 6 10 6.45 10 7V8H9C8.45 8 8 8.45 8 9C8 9.55 8.45 10 9 10H16C16.55 10 17 10.45 17 11V13C17 13.55 16.55 14 16 14H8C7.45 14 7 13.55 7 13V11C7 10.45 6.55 10 6 10C5.45 10 5 10.45 5 11V14C5 15.66 6.34 17 8 17H9V19C9 20.1 9.9 21 11 21H14C15.1 21 16 20.1 16 19V17H17C18.66 17 20 15.66 20 14V10C20 8.34 18.66 7 17 7V8Z" fill="currentColor"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM5 8V6H19V8H5ZM7 12H9V14H7V12ZM11 12H13V14H11V12ZM15 12H17V14H15V12Z" fill="currentColor"/>
  </svg>
);

// Mock data
const summaryData = [
  { 
    title: 'Total Value', 
    value: '$485,750', 
    description: 'Current portfolio value',
    icon: <DollarIcon />,
    color: 'blue'
  },
  { 
    title: 'Contributions', 
    value: '$125,000', 
    description: 'Total contributions',
    icon: <PiggyBankIcon />,
    color: 'green'
  },
  { 
    title: 'Investment Gains', 
    value: '$85,750', 
    description: 'Total growth',
    icon: <TrendingUpIcon />,
    color: 'orange'
  },
];

const transactions = [
  { id: 1, date: '2024-01-15', type: 'Contribution', amount: 2500, description: 'Monthly contribution', status: 'Completed' },
  { id: 2, date: '2024-01-10', type: 'Investment', amount: -1500, description: 'Stock purchase', status: 'Completed' },
  { id: 3, date: '2024-01-05', type: 'Dividend', amount: 450, description: 'Quarterly dividend', status: 'Completed' },
  { id: 4, date: '2023-12-28', type: 'Fee', amount: -25, description: 'Account fee', status: 'Completed' },
];

const assetAllocation = [
  { name: 'Stocks', value: 60, color: 'blue' },
  { name: 'Bonds', value: 25, color: 'green' },
  { name: 'Cash', value: 10, color: 'orange' },
  { name: 'Other', value: 5, color: 'gray' },
];

const performanceData = [
  { date: 'Jan', value: 420000 },
  { date: 'Feb', value: 425000 },
  { date: 'Mar', value: 430000 },
  { date: 'Apr', value: 435000 },
  { date: 'May', value: 440000 },
  { date: 'Jun', value: 445000 },
];

// Types
interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
}

interface TransactionRowProps {
  date: string;
  type: string;
  amount: number;
  description: string;
  status: string;
}

// Helper components
const SummaryCard = ({ title, value, description, icon, color = 'blue' }: SummaryCardProps) => (
  <Card withBorder radius="md" p="md">
    <Group justify="space-between">
      <Text size="sm" c="dimmed" fw={700} tt="uppercase">
        {title}
      </Text>
      <Box c={color}>
        {icon}
      </Box>
    </Group>

    <Group align="flex-end" gap="xs" mt={25}>
      <Text fz="xl" fw={700}>
        {value}
      </Text>
    </Group>
    <Text fz="xs" c="dimmed" mt={7}>
      {description}
    </Text>
  </Card>
);

const TransactionRow = ({ date, type, amount, description, status }: TransactionRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <Table.Tr>
      <Table.Td>{new Date(date).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Badge color={type === 'Contribution' ? 'blue' : 'green'} variant="light">
          {type}
        </Badge>
      </Table.Td>
      <Table.Td>{description}</Table.Td>
      <Table.Td c={amount > 0 ? 'green' : 'red'} fw={500}>
        {amount > 0 ? '+' : ''}
        ${Math.abs(amount).toLocaleString()}
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(status)} variant="light">
          {status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  );
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timeframes = [
    { value: '1m', label: 'Last Month' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '12m', label: 'Last 12 Months' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">Pension Dashboard</Title>
      
      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" mb="xl">
        {summaryData.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="investments">Investments</Tabs.Tab>
          <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="xl">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" mb="xl">
            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="md">Portfolio Performance</Title>
              <Box h={300}>
                <AreaChart
                  h={300}
                  data={performanceData}
                  dataKey="date"
                  series={[{ name: 'value', label: 'Portfolio Value', color: 'blue' }]}
                  curveType="linear"
                  withYAxis={false}
                  withDots={false}
                  withGradient
                  gridAxis="x"
                />
              </Box>
            </Paper>
            
            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="md">Asset Allocation</Title>
              <Box h={300}>
                <PieChart
                  data={assetAllocation}
                  withTooltip
                  tooltipDataSource="segment"
                  withLabels
                  labelsPosition="inside"
                  labelsType="percent"
                  withLabelsLine
                />
              </Box>
              <Stack gap="xs" mt="md">
                {assetAllocation.map((item) => (
                  <div key={item.name}>
                    <Group justify="space-between" mb={4}>
                      <Text fz="sm">{item.name}</Text>
                      <Text fw={500} fz="sm">{item.value}%</Text>
                    </Group>
                    <Progress value={item.value} color={item.color} />
                  </div>
                ))}
              </Stack>
            </Paper>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="investments" pt="xl">
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">Your Investments</Title>
            <Text c="dimmed" mb="md">Manage and track your investment portfolio</Text>
            {/* Investment content would go here */}
            <Text>Investment details coming soon...</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="transactions" pt="xl">
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="md">
              <Title order={4}>Transaction History</Title>
              <Group>
                <TextInput
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                  rightSection={
                    <Box c="dimmed" style={{ pointerEvents: 'none' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                      </svg>
                    </Box>
                  }
                />
                <Select
                  placeholder="Timeframe"
                  data={timeframes}
                  value={selectedTimeframe}
                  onChange={(value) => setSelectedTimeframe(value || '6m')}
                  leftSection={
                    <Box c="dimmed">
                      <CalendarIcon />
                    </Box>
                  }
                  style={{ width: 180 }}
                />
              </Group>
            </Group>
            
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} {...transaction} />
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}