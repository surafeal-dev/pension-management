import React from 'react';
import { 
  Title, 
  Stack,
  Container
} from '@mantine/core';
import ContributionHistory from '../components/ContributionHistory';
import RecentTransactions from '../components/RecentTransactions';

const TransactionsPage = () => {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <Title order={2} fw={700} mb="md">Transactions</Title>
        
        <ContributionHistory />
        <RecentTransactions />
      </Stack>
    </Container>
  );
};

export default TransactionsPage;
