import React from 'react';
import { 
  Title, 
  Text,
  Box,
  Stack, 
  SimpleGrid,
  Container
} from '@mantine/core';
import DashboardOverview from '../components/DashboardOverview';
import AssetAllocation from '../components/AssetAllocation';
import PortfolioHoldings from '../components/PortfolioHoldings';

const DashboardPage = () => {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <Box>
          <Title order={2} fw={700} mb="xs">Welcome back, John</Title>
          <Text c="dimmed" mb="md">Here's what's happening with your pension today</Text>
        </Box>
        
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
    </Container>
  );
};

export default DashboardPage;
