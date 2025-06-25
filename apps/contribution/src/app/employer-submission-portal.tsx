// File: apps/contribution/src/app/employer-submission-portal.tsx
'use client';

import { useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Stepper,
  Group,
  Button,
  Paper,
  Center,
  rem,
  Table,
  NumberFormatter,
  Card, // <-- FIX: Added Card to imports
} from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import {
  IconUpload,
  IconFileCheck,
  IconCreditCard,
  IconCircleCheck,
  IconX,
} from '@tabler/icons-react';

// Mock data that would be parsed from the uploaded file
const mockParsedData = {
  employees: [
    { id: 'E101', name: 'Alice Johnson', salary: 75000, contribution: 600 },
    { id: 'E102', name: 'Bob Williams', salary: 82000, contribution: 656 },
    { id: 'E103', name: 'Charlie Brown', salary: 65000, contribution: 520 },
  ],
  summary: {
    totalEmployees: 152,
    totalSalary: 11_400_000,
    totalContribution: 91_200,
  },
};

export default function EmployerSubmissionPortal() {
  const [active, setActive] = useState(0);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const tableRows = mockParsedData.employees.map((emp) => (
    <Table.Tr key={emp.id}>
      <Table.Td>{emp.id}</Table.Td>
      <Table.Td>{emp.name}</Table.Td>
      <Table.Td>
        <NumberFormatter value={emp.salary} prefix="$" thousandSeparator />
      </Table.Td>
      <Table.Td fw={700}>
        <NumberFormatter
          value={emp.contribution}
          prefix="$"
          thousandSeparator
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} size="h2" mb="xs">
            Contribution Submission
          </Title>
          <Text c="dimmed" size="lg">
            For period: October 2024 (Due Nov 15, 2024)
          </Text>
        </div>

        <Paper withBorder shadow="sm" p="xl" radius="md">
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              label="Upload"
              description="Upload payroll file"
              icon={<IconUpload size={18} />}
            >
              <Text size="lg" fw={500} mb="md">
                Step 1: Upload Payroll Data
              </Text>
              <Text c="dimmed" mb="xl">
                Please upload your payroll report for the current contribution
                period. Accepted formats: CSV, XLSX.
              </Text>
              <Dropzone
                onDrop={setFiles}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={5 * 1024 ** 2}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: 'none' }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      style={{ width: rem(52), height: rem(52) }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{ width: rem(52), height: rem(52) }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconFileCheck
                      style={{ width: rem(52), height: rem(52) }}
                      stroke={1.5}
                    />
                  </Dropzone.Idle>
                  <div>
                    <Text size="xl" inline>
                      Drag your file here or click to select
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      File should not exceed 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Stepper.Step>

            <Stepper.Step
              label="Verify"
              description="Review data"
              icon={<IconFileCheck size={18} />}
            >
              <Text size="lg" fw={500} mb="md">
                Step 2: Review and Verify
              </Text>
              <Text c="dimmed" mb="xl">
                Please verify the summary and a sample of the employee data
                parsed from your file.
              </Text>
              <Paper withBorder p="md" radius="sm" mb="lg">
                <Group justify="space-around">
                  <div>
                    <Text c="dimmed" size="sm">
                      Total Employees
                    </Text>
                    <Text fw={700} size="xl">
                      {mockParsedData.summary.totalEmployees}
                    </Text>
                  </div>
                  <div>
                    <Text c="dimmed" size="sm">
                      Total Monthly Salary
                    </Text>
                    <Text fw={700} size="xl">
                      <NumberFormatter
                        value={mockParsedData.summary.totalSalary}
                        prefix="$"
                        thousandSeparator
                      />
                    </Text>
                  </div>
                  <div>
                    <Text c="dimmed" size="sm">
                      Total Contribution Due
                    </Text>
                    <Text fw={700} size="xl" c="blue">
                      <NumberFormatter
                        value={mockParsedData.summary.totalContribution}
                        prefix="$"
                        thousandSeparator
                      />
                    </Text>
                  </div>
                </Group>
              </Paper>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Gross Salary</Table.Th>
                    <Table.Th>Contribution</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{tableRows}</Table.Tbody>
              </Table>
            </Stepper.Step>

            <Stepper.Step
              label="Payment"
              description="Submit payment"
              icon={<IconCreditCard size={18} />}
            >
              <Text size="lg" fw={500} mb="md">
                Step 3: Confirm and Pay
              </Text>
              <Text c="dimmed" mb="xl">
                Choose a payment method to complete your contribution.
              </Text>
              <Card withBorder p="xl">
                <Title order={4}>Payment Summary</Title>
                <Group justify="space-between" mt="md">
                  <Text>Total Contribution Amount</Text>
                  <Text fw={700} size="lg">
                    <NumberFormatter
                      value={mockParsedData.summary.totalContribution}
                      prefix="$"
                      thousandSeparator
                    />
                  </Text>
                </Group>
                <Group justify="space-between" mt="xs" mb="xl">
                  <Text c="dimmed">For Period</Text>
                  <Text c="dimmed">October 2024</Text>
                </Group>
                <Button fullWidth size="lg">
                  Pay with Linked Bank Account
                </Button>
                <Button fullWidth variant="default" mt="md">
                  Other Payment Methods
                </Button>
              </Card>
            </Stepper.Step>

            <Stepper.Completed>
              <Center style={{ flexDirection: 'column' }} h={300}>
                <IconCircleCheck
                  size={80}
                  color="var(--mantine-color-green-6)"
                />
                <Title order={2} mt="md">
                  Submission Complete!
                </Title>
                <Text c="dimmed" mt="xs">
                  Your contribution of{' '}
                  <Text span fw={700}>
                    <NumberFormatter
                      value={mockParsedData.summary.totalContribution}
                      prefix="$"
                      thousandSeparator
                    />
                  </Text>{' '}
                  has been submitted.
                </Text>
                <Text c="dimmed">
                  A confirmation email has been sent to you.
                </Text>
                <Button mt="xl" onClick={() => setActive(0)}>
                  Submit Another Contribution
                </Button>
              </Center>
            </Stepper.Completed>
          </Stepper>

          <Group justify="flex-end" mt="xl">
            {active !== 0 && active < 3 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < 3 && (
              <Button onClick={nextStep}>
                {active === 2 ? 'Confirm & Proceed to Payment' : 'Next step'}
              </Button>
            )}
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}
