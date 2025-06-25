import React from 'react';
import { 
  Title, 
  Stack, 
  SimpleGrid,
  Container
} from '@mantine/core';
import AssetAllocation from '../components/AssetAllocation';
import PortfolioHoldings from '../components/PortfolioHoldings';

const InvestmentsPage = () => {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <Title order={2} fw={700} mb="md">Investment Portfolio</Title>
        
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <AssetAllocation />
          <PortfolioHoldings />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default InvestmentsPage;
