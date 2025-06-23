import { useState, useMemo } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Group, 
  Select, 
  Stack, 
  Paper,
  rem,
  Badge
} from '@mantine/core';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { IconCalendar, IconFilter, IconInfoCircle } from '@tabler/icons-react';

// Sample data for the last 12 months
const generateContributionData = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  return months.map((month, index) => {
    // Calculate the year (if month is in the past relative to current month, use current year, else previous year)
    const year = index <= currentMonth ? currentYear : currentYear - 1;
    const monthIndex = index <= currentMonth ? index : 12 + index - currentMonth - 1;
    
    // Generate a random contribution amount between 500 and 3000
    const contribution = Math.floor(Math.random() * 2500) + 500;
    
    // Add some variation for employer match (typically a percentage of employee contribution)
    const employerMatch = Math.floor(contribution * (Math.random() * 0.3 + 0.3)); // 30-60% of employee contribution
    
    // Add some months with additional voluntary contributions
    const voluntary = Math.random() > 0.7 ? Math.floor(Math.random() * 1000) + 200 : 0;
    
    return {
      month: `${month} '${year.toString().slice(-2)}`,
      monthIndex,
      year,
      employee: contribution,
      employer: employerMatch,
      voluntary,
      total: contribution + employerMatch + voluntary
    };
  }).sort((a, b) => {
    // Sort by year and month
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });
};

const timeRanges = [
  { value: '1y', label: 'Last 12 Months' },
  { value: '3y', label: 'Last 3 Years' },
  { value: '5y', label: 'Last 5 Years' },
  { value: 'all', label: 'All Time' },
];

const contributionTypes = [
  { value: 'all', label: 'All Contributions' },
  { value: 'employee', label: 'Employee Contributions' },
  { value: 'employer', label: 'Employer Match' },
  { value: 'voluntary', label: 'Voluntary Contributions' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="md" shadow="md" withBorder>
        <Text size="sm" fw={500} mb="xs">{label}</Text>
        {payload.map((entry: any, index: number) => (
          <Text 
            key={`tooltip-item-${index}`} 
            size="sm" 
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

export const ContributionHistory = () => {
  const [timeRange, setTimeRange] = useState('1y');
  const [contributionType, setContributionType] = useState('all');
  
  // Generate sample data
  const allData = useMemo(() => generateContributionData(), []);
  
  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return allData.filter(item => {
      if (timeRange === '1y') return true; // Last 12 months is already handled in data generation
      
      const yearsAgo = parseInt(timeRange);
      const itemDate = new Date(item.year, item.monthIndex, 1);
      const cutoffDate = new Date(currentYear - yearsAgo, currentMonth, 1);
      
      return itemDate >= cutoffDate;
    });
  }, [allData, timeRange]);
  
  // Calculate summary stats
  const summary = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      total: acc.total + curr.total,
      employee: acc.employee + curr.employee,
      employer: acc.employer + curr.employer,
      voluntary: acc.voluntary + curr.voluntary,
      count: acc.count + 1
    }), { total: 0, employee: 0, employer: 0, voluntary: 0, count: 0 });
  }, [filteredData]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate average monthly contribution
  const averageMonthly = summary.count > 0 
    ? summary.total / summary.count 
    : 0;

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Contribution History</Title>
        <Group>
          <Select
            placeholder="Time Range"
            value={timeRange}
            onChange={(value) => setTimeRange(value || '1y')}
            data={timeRanges}
            leftSection={<IconCalendar size={16} />}
            size="xs"
          />
          <Select
            placeholder="Contribution Type"
            value={contributionType}
            onChange={(value) => setContributionType(value || 'all')}
            data={contributionTypes}
            leftSection={<IconFilter size={16} />}
            size="xs"
          />
        </Group>
      </Group>
      
      <Stack gap="md">
        <Group gap="xl">
          <div>
            <Text size="sm" c="dimmed">Total Contributions</Text>
            <Title order={3} fw={700}>{formatCurrency(summary.total)}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">Average Monthly</Text>
            <Title order={3} fw={700}>{formatCurrency(averageMonthly)}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">Employee Contributions</Text>
            <Title order={3} fw={700}>{formatCurrency(summary.employee)}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">Employer Match</Text>
            <Title order={3} fw={700}>{formatCurrency(summary.employer)}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">Voluntary</Text>
            <Title order={3} fw={700}>{formatCurrency(summary.voluntary)}</Title>
          </div>
        </Group>
        
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-gray-2)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--mantine-color-dimmed)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `$${value / 1000}k`} 
                tick={{ fill: 'var(--mantine-color-dimmed)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => (
                  <Text size="xs" c="dimmed">
                    {value}
                  </Text>
                )}
              />
              {contributionType === 'all' && (
                <Area 
                  type="monotone" 
                  dataKey="employee" 
                  stackId="1" 
                  stroke="var(--mantine-color-blue-6)" 
                  fill="var(--mantine-color-blue-2)" 
                  name="Employee"
                />
              )}
              {contributionType === 'all' && (
                <Area 
                  type="monotone" 
                  dataKey="employer" 
                  stackId="1" 
                  stroke="var(--mantine-color-green-6)" 
                  fill="var(--mantine-color-green-2)" 
                  name="Employer Match"
                />
              )}
              {contributionType === 'all' && (
                <Area 
                  type="monotone" 
                  dataKey="voluntary" 
                  stackId="1" 
                  stroke="var(--mantine-color-violet-6)" 
                  fill="var(--mantine-color-violet-2)" 
                  name="Voluntary"
                />
              )}
              {contributionType !== 'all' && (
                <Area 
                  type="monotone" 
                  dataKey={contributionType} 
                  stroke="var(--mantine-color-blue-6)" 
                  fill="var(--mantine-color-blue-2)" 
                  name={contributionTypes.find(t => t.value === contributionType)?.label || 'Contributions'}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <Group gap="xs" c="dimmed" mt="sm">
          <IconInfoCircle size={16} />
          <Text size="xs">
            {timeRange === '1y' ? 'Last 12 months' : 
             timeRange === '3y' ? 'Last 3 years' : 
             timeRange === '5y' ? 'Last 5 years' : 'All time'} • 
            {contributionType === 'all' ? 'All contribution types' : 
             `Showing only ${contributionType} contributions`}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default ContributionHistory;
