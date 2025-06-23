import { Card, Title, Table, Text, Badge, Group, Box } from '@mantine/core';
import { ArrowUpRight, ArrowDownRight } from 'tabler-icons-react';

type Holding = {
  id: string;
  name: string;
  symbol: string;
  type: 'Stock' | 'Bond' | 'Fund' | 'Cash' | 'Other';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change: number;
  changePercent: number;
};

const holdings: Holding[] = [
  {
    id: '1',
    name: 'S&P 500 Index Fund',
    symbol: 'VOO',
    type: 'Fund',
    shares: 25,
    avgPrice: 350.42,
    currentPrice: 412.76,
    value: 10319.0,
    change: 62.34,
    changePercent: 7.11,
  },
  {
    id: '2',
    name: 'US Treasury Bond',
    symbol: 'GOVT',
    type: 'Bond',
    shares: 50,
    avgPrice: 52.3,
    currentPrice: 54.12,
    value: 2706.0,
    change: 1.82,
    changePercent: 3.48,
  },
  {
    id: '3',
    name: 'Apple Inc',
    symbol: 'AAPL',
    type: 'Stock',
    shares: 15,
    avgPrice: 145.67,
    currentPrice: 172.88,
    value: 2593.2,
    change: 27.21,
    changePercent: 18.68,
  },
  {
    id: '4',
    name: 'Microsoft Corp',
    symbol: 'MSFT',
    type: 'Stock',
    shares: 10,
    avgPrice: 280.55,
    currentPrice: 325.12,
    value: 3251.2,
    change: 44.57,
    changePercent: 15.89,
  },
  {
    id: '5',
    name: 'Cash & Equivalents',
    symbol: 'CASH',
    type: 'Cash',
    shares: 1,
    avgPrice: 1,
    currentPrice: 1,
    value: 1250.75,
    change: 0,
    changePercent: 0,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Stock':
      return 'blue';
    case 'Bond':
      return 'green';
    case 'Fund':
      return 'violet';
    case 'Cash':
      return 'gray';
    default:
      return 'gray';
  }
};

export const PortfolioHoldings = () => {
  const rows = holdings.map((holding) => {
    const isPositive = holding.changePercent >= 0;
    const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    
    return (
      <Table.Tr key={holding.id}>
        <Table.Td>
          <div>
            <Text fw={500}>{holding.name}</Text>
            <Text size="xs" c="dimmed">{holding.symbol}</Text>
          </div>
        </Table.Td>
        <Table.Td>
          <Badge color={getTypeColor(holding.type)} variant="light">
            {holding.type}
          </Badge>
        </Table.Td>
        <Table.Td>{holding.shares.toFixed(2)}</Table.Td>
        <Table.Td>${holding.avgPrice.toFixed(2)}</Table.Td>
        <Table.Td>${holding.currentPrice.toFixed(2)}</Table.Td>
        <Table.Td>${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Table.Td>
        <Table.Td>
          <Group gap={4} justify="flex-end">
            <ChangeIcon 
              size={16} 
              color={isPositive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-red-6)'} 
            />
            <Text c={isPositive ? 'green' : 'red'}>
              {isPositive ? '+' : ''}{holding.changePercent.toFixed(2)}%
            </Text>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Title order={4} mb="md">Portfolio Holdings</Title>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Investment</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Shares</Table.Th>
              <Table.Th>Avg. Cost</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Market Value</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Change (YTD)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
};

export default PortfolioHoldings;
