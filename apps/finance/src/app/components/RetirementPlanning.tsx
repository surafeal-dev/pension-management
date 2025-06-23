import { Tabs, Title, Text, Stack, Paper, Group, Button, Box, rem } from '@mantine/core';
import { IconCalculator, IconChartLine, IconTarget } from '@tabler/icons-react';
import { RetirementProjections } from './RetirementProjections';
import { WithdrawalPlanner } from './WithdrawalPlanner';

export const RetirementPlanning = () => {
  return (
    <Stack gap="md">
      <Box>
        <Title order={3} mb="xs">Retirement Planning</Title>
        <Text c="dimmed" size="sm">
          Plan your retirement with our comprehensive tools and projections
        </Text>
      </Box>
      
      <Tabs defaultValue="projections">
        <Tabs.List>
          <Tabs.Tab 
            value="projections" 
            leftSection={<IconChartLine size={16} />}
          >
            Projections
          </Tabs.Tab>
          <Tabs.Tab 
            value="withdrawals" 
            leftSection={<IconCalculator size={16} />}
          >
            Withdrawal Strategy
          </Tabs.Tab>
          <Tabs.Tab 
            value="goals" 
            leftSection={<IconTarget size={16} />}
            disabled
          >
            Retirement Goals
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="projections" pt="md">
          <RetirementProjections />
        </Tabs.Panel>
        
        <Tabs.Panel value="withdrawals" pt="md">
          <WithdrawalPlanner />
        </Tabs.Panel>
        
        <Tabs.Panel value="goals" pt="md">
          <Paper withBorder p="md" radius="md">
            <Text c="dimmed" ta="center" py="xl">
              Retirement Goals Tracker - Coming Soon
            </Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default RetirementPlanning;
