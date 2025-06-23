import { SimpleGrid, Card, Text, Title, Progress, Group, Box, SegmentedControl, Stack } from '@mantine/core';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';

// Types
type SummaryCardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

// Sample data for different time periods
const chartData = {
  '1M': [
    { date: 'Week 1', value: 4000 },
    { date: 'Week 2', value: 3000 },
    { date: 'Week 3', value: 5000 },
    { date: 'Week 4', value: 5890 },
  ],
  '3M': [
    { date: 'Jan', value: 4000 },
    { date: 'Feb', value: 3000 },
    { date: 'Mar', value: 5000 },
  ],
  '6M': [
    { date: 'Jan', value: 4000 },
    { date: 'Feb', value: 3000 },
    { date: 'Mar', value: 5000 },
    { date: 'Apr', value: 2780 },
    { date: 'May', value: 5890 },
    { date: 'Jun', value: 6390 },
  ],
  '1Y': [
    { date: 'Q1', value: 4000 },
    { date: 'Q2', value: 5890 },
    { date: 'Q3', value: 7200 },
    { date: 'Q4', value: 8500 },
  ],
  'ALL': [
    { date: '2020', value: 3000 },
    { date: '2021', value: 5200 },
    { date: '2022', value: 4800 },
    { date: '2023', value: 6500 },
    { date: '2024', value: 8500 },
  ],
};

// SVG Icons
const MoneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10ZM7 8C5.9 8 5 7.1 5 6C5 4.9 5.9 4 7 4C8.1 4 9 4.9 9 6C9 7.1 8.1 8 7 8ZM17 8C15.9 8 15 7.1 15 6C15 4.9 15.9 4 17 4C18.1 4 19 4.9 19 6C19 7.1 18.1 8 17 8Z" fill="currentColor"/>
  </svg>
);

const GrowthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor"/>
  </svg>
);

const ContributionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V11H7V13H11V17H13V13H17V11H13V7Z" fill="currentColor"/>
  </svg>
);

const SummaryCard = ({ title, value, change, icon }: SummaryCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed" fw={700}>
          {title}
        </Text>
        <Box c="blue">
          {icon}
        </Box>
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text fz="xl" fw={700}>
          {value}
        </Text>
        <Text c={isPositive ? 'green' : 'red'} fw={500}>
          {isPositive ? '+' : ''}{change}%
        </Text>
      </Group>
      <Progress value={Math.abs(change)} mt="md" size="sm" color={isPositive ? 'green' : 'red'} />
    </Card>
  );
};

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState('1Y');
  const data = useMemo(() => chartData[timeRange as keyof typeof chartData] || [], [timeRange]);

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Portfolio Performance</Title>
        <SegmentedControl
          value={timeRange}
          onChange={setTimeRange}
          data={[
            { label: '1M', value: '1M' },
            { label: '3M', value: '3M' },
            { label: '6M', value: '6M' },
            { label: '1Y', value: '1Y' },
            { label: 'ALL', value: 'ALL' },
          ]}
          size="xs"
        />
      </Group>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--mantine-primary-color-filled)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--mantine-primary-color-filled)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              width={80}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-gray-2)" />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                background: 'var(--mantine-color-white)',
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: 'var(--mantine-radius-md)',
                padding: 'var(--mantine-spacing-xs)',
                fontSize: 'var(--mantine-font-size-sm)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--mantine-primary-color-filled)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const DashboardOverview = () => {
  return (
    <div>
      <Title order={3} mb="md">Dashboard Overview</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <SummaryCard
          title="Total Value"
          value="$45,231.89"
          change={13.5}
          icon={<MoneyIcon />}
        />
        <SummaryCard
          title="Contributions (YTD)"
          value="$12,500.00"
          change={8.2}
          icon={<ContributionIcon />}
        />
        <SummaryCard
          title="Growth (YTD)"
          value="+15.4%"
          change={15.4}
          icon={<GrowthIcon />}
        />
      </SimpleGrid>
      
      <PerformanceChart />
    </div>
  );
};

export default DashboardOverview;
