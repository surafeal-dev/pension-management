import { Card, Title, Text, Group, Stack, Paper, rem, Box } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Sample data for the pie chart
const data = [
  { name: 'Stocks', value: 45, color: 'var(--mantine-color-blue-6)' },
  { name: 'Bonds', value: 25, color: 'var(--mantine-color-green-6)' },
  { name: 'Real Estate', value: 15, color: 'var(--mantine-color-yellow-6)' },
  { name: 'Cash', value: 10, color: 'var(--mantine-color-gray-6)' },
  { name: 'Other', value: 5, color: 'var(--mantine-color-orange-6)' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="sm" shadow="md" withBorder>
        <Text size="sm">{payload[0].name}: {payload[0].value}%</Text>
      </Paper>
    );
  }
  return null;
};

export const AssetAllocation = () => {
  return (
    <Card withBorder p="md" radius="md" h="100%">
      <Title order={4} mb="md">Asset Allocation</Title>
      <Group align="flex-start" gap="xl">
        <div style={{ width: '200px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <Stack gap="xs">
          {data.map((item, index) => (
            <Group key={index} gap="sm">
              <Box
                style={{
                  width: rem(12),
                  height: rem(12),
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <Text size="sm">{item.name}</Text>
              <Text size="sm" fw={500} ml="auto">
                {item.value}%
              </Text>
            </Group>
          ))}
        </Stack>
      </Group>
    </Card>
  );
};

export default AssetAllocation;
