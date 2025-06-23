import { useState, useMemo } from 'react';
import { 
  Card, 
  Title, 
  Table, 
  Text, 
  Badge, 
  Group, 
  TextInput, 
  Select, 
  Stack, 
  ActionIcon,
  Menu,
  rem
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconDownload, 
  IconPrinter,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort
} from '@tabler/icons-react';

type TransactionType = 'Contribution' | 'Withdrawal' | 'Dividend' | 'Interest' | 'Adjustment' | 'Other';
type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Reversed';

interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  account: string;
}

const transactionTypes: TransactionType[] = [
  'Contribution',
  'Withdrawal',
  'Dividend',
  'Interest',
  'Adjustment',
  'Other'
];

const statuses: TransactionStatus[] = [
  'Completed',
  'Pending',
  'Failed',
  'Reversed'
];

const accounts = [
  'Main Retirement Account',
  'Roth IRA',
  'Rollover IRA',
  'Brokerage Account'
];

// Generate sample transaction data
const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const transactionDate = new Date(now);
    transactionDate.setDate(now.getDate() - daysAgo);
    
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = Math.random() * 5000 + 100;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    
    transactions.push({
      id: `txn-${1000 + i}`,
      date: transactionDate,
      description: `${type} ${type === 'Dividend' ? 'from ' + ['Apple', 'Microsoft', 'Vanguard', 'Fidelity'][Math.floor(Math.random() * 4)] : ''}`.trim(),
      type,
      amount: type === 'Withdrawal' ? -amount : amount,
      status,
      account
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'yellow';
    case 'Failed':
      return 'red';
    case 'Reversed':
      return 'gray';
    default:
      return 'blue';
  }
};

type SortField = 'date' | 'amount' | 'type' | 'status' | 'account';
type SortDirection = 'asc' | 'desc' | null;

export const RecentTransactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const transactions = useMemo(() => generateTransactions(50), []);
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !typeFilter || transaction.type === typeFilter;
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesAccount = !accountFilter || transaction.account === accountFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesAccount;
    }).sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        const aValue = String(a[sortField as keyof Transaction]);
        const bValue = String(b[sortField as keyof Transaction]);
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });
  }, [searchQuery, typeFilter, statusFilter, accountFilter, sortField, sortDirection, transactions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(current => {
        if (current === 'desc') return 'asc';
        if (current === 'asc') return null;
        return 'desc';
      });
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <IconArrowsSort size={16} />;
    if (sortDirection === 'asc') return <IconArrowUp size={16} />;
    if (sortDirection === 'desc') return <IconArrowDown size={16} />;
    return <IconArrowsSort size={16} />;
  };

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Recent Transactions</Title>
        <Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <IconFilter size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Filters</Menu.Label>
              <Select
                label="Type"
                placeholder="Filter by type"
                data={transactionTypes}
                value={typeFilter}
                onChange={setTypeFilter}
                clearable
              />
              <Select
                label="Status"
                placeholder="Filter by status"
                data={statuses}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
                mt="sm"
              />
              <Select
                label="Account"
                placeholder="Filter by account"
                data={accounts}
                value={accountFilter}
                onChange={setAccountFilter}
                clearable
                mt="sm"
              />
              {typeFilter || statusFilter || accountFilter ? (
                <Menu.Divider />
              ) : null}
              {(typeFilter || statusFilter || accountFilter) && (
                <Menu.Item 
                  color="red" 
                  onClick={() => {
                    setTypeFilter(null);
                    setStatusFilter(null);
                    setAccountFilter(null);
                  }}
                >
                  Clear filters
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <IconDownload size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Export Options</Menu.Label>
              <Menu.Item leftSection={<IconDownload size={14} />}>
                Download as CSV
              </Menu.Item>
              <Menu.Item leftSection={<IconPrinter size={14} />}>
                Print
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
      
      <TextInput
        placeholder="Search transactions..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />
      
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('date')}
              >
                <Group gap={4}>
                  Date
                  {renderSortIcon('date')}
                </Group>
              </Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('type')}
              >
                <Group gap={4}>
                  Type
                  {renderSortIcon('type')}
                </Group>
              </Table.Th>
              <Table.Th 
                style={{ textAlign: 'right', cursor: 'pointer' }}
                onClick={() => handleSort('amount')}
              >
                <Group justify="flex-end" gap={4}>
                  Amount
                  {renderSortIcon('amount')}
                </Group>
              </Table.Th>
              <Table.Th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('status')}
              >
                <Group gap={4}>
                  Status
                  {renderSortIcon('status')}
                </Group>
              </Table.Th>
              <Table.Th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('account')}
              >
                <Group gap={4}>
                  Account
                  {renderSortIcon('account')}
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <Table.Tr key={transaction.id}>
                  <Table.Td>{formatDate(transaction.date)}</Table.Td>
                  <Table.Td>
                    <Text fw={500}>{transaction.description}</Text>
                    <Text size="xs" c="dimmed">ID: {transaction.id}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      variant="light" 
                      color={
                        transaction.type === 'Contribution' ? 'blue' :
                        transaction.type === 'Withdrawal' ? 'red' :
                        transaction.type === 'Dividend' ? 'green' :
                        transaction.type === 'Interest' ? 'yellow' : 'gray'
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td align="right">
                    <Text 
                      fw={500} 
                      c={transaction.amount >= 0 ? 'green' : 'red'}
                    >
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      variant="light" 
                      color={getStatusColor(transaction.status)}
                    >
                      {transaction.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{transaction.account}</Text>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: 'center' }} py="xl">
                  <Stack align="center" gap="xs">
                    <Text fw={500}>No transactions found</Text>
                    <Text c="dimmed" size="sm">
                      Try adjusting your search or filter criteria
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      
      {filteredTransactions.length > 0 && (
        <Text c="dimmed" size="sm" mt="sm">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </Text>
      )}
    </Card>
  );
};

export default RecentTransactions;
