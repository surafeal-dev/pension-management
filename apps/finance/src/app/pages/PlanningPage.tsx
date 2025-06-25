import React from 'react';
import { 
  Title, 
  Stack,
  Container
} from '@mantine/core';
import RetirementPlanning from '../components/RetirementPlanning';

const PlanningPage = () => {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <Title order={2} fw={700} mb="md">Retirement Planning</Title>
        
        <RetirementPlanning />
      </Stack>
    </Container>
  );
};

export default PlanningPage;
