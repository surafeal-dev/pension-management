"use client"

import {
  Card, 
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  Badge,
  Button,
  Container,
  NumberFormatter,
  Timeline,
  RingProgress,
  Center,
} from "@mantine/core"
import {
  IconCheck,
  IconCircleDashed,
  IconCoin,
  IconFileText,
  IconMail,
  IconReceipt,
  IconTrendingUp,
  IconUser,
  IconAlertTriangle,
  IconRefresh,
} from "@tabler/icons-react"

// Mock Data for the Admin Dashboard
const dashboardMetrics = {
  totalCollectedThisMonth: 1_250_000,
  overdueContributions: 75_000,
  pendingReconciliation: 15,
  activeBreaches: 4,
}

const recentActivity = [
  {
    title: "Contribution Submitted - TechCorp Inc.",
    time: "10 minutes ago",
    details: "$55,000 for 150 employees",
    icon: <IconCheck size={16} />,
    color: "green",
  },
  {
    title: "New Breach Detected - Global Imports",
    time: "2 hours ago",
    details: "Contribution overdue by 3 days",
    icon: <IconAlertTriangle size={16} />,
    color: "red",
  },
  {
    title: "Bank Statement Imported",
    time: "4 hours ago",
    details: "CitiBank - Statement for 2024-10-25",
    icon: <IconFileText size={16} />,
    color: "blue",
  },
  {
    title: "Penalty Paid - BuildRight LLC",
    time: "1 day ago",
    details: "$500 late fee cleared",
    icon: <IconCoin size={16} />,
    color: "gray",
  },
]

export default function AdminDashboard() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} size="h2" mb="xs">
              Administrator Dashboard
            </Title>
            <Text c="dimmed" size="lg">
              System-wide overview of pension contributions
            </Text>
          </div>
          <Group>
            <Button leftSection={<IconRefresh size={16} />} variant="light">
              Refresh Data
            </Button>
          </Group>
        </Group>

        {/* Key Metrics Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed" fw={500}>
                  Collected This Month
                </Text>
                <IconTrendingUp size={24} color="var(--mantine-color-green-6)" />
              </Group>
              <Text fw={700} fz={32} mt="sm"> {/* <--- FIX: Changed size to fz */}
                <NumberFormatter value={dashboardMetrics.totalCollectedThisMonth} prefix="$" thousandSeparator />
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed" fw={500}>
                  Overdue Contributions
                </Text>
                <IconAlertTriangle size={24} color="var(--mantine-color-red-6)" />
              </Group>
              <Text fw={700} fz={32} mt="sm"> {/* <--- FIX: Changed size to fz */}
                <NumberFormatter value={dashboardMetrics.overdueContributions} prefix="$" thousandSeparator />
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed" fw={500}>
                  Pending Reconciliation
                </Text>
                <IconCircleDashed size={24} color="var(--mantine-color-orange-6)" />
              </Group>
              <Text fw={700} fz={32} mt="sm"> {/* <--- FIX: Changed size to fz */}
                {dashboardMetrics.pendingReconciliation}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Text size="sm" c="dimmed" fw={500}>
                  Active Breaches
                </Text>
                <IconAlertTriangle size={24} color="var(--mantine-color-yellow-6)" />
              </Group>
              <Text fw={700} fz={32} mt="sm"> {/* <--- FIX: Changed size to fz */}
                {dashboardMetrics.activeBreaches}
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          {/* Recent Activity Feed */}
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Title order={3} size="h4" mb="lg">
                Recent Activity
              </Title>
              <Timeline active={4} bulletSize={24} lineWidth={2}>
                {recentActivity.map((item, index) => (
                  <Timeline.Item key={index} bullet={item.icon} title={item.title} c={item.color}>
                    <Text c="dimmed" size="sm">
                      {item.details}
                    </Text>
                    <Text size="xs" mt={4}>
                      {item.time}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Paper>
          </Grid.Col>

          {/* Contribution Status & Quick Actions */}
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Stack>
              <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} size="h5" mb="md">
                  Contribution Status Overview
                </Title>
                <Center>
                  <RingProgress
                    size={180}
                    thickness={16}
                    sections={[
                      { value: 80, color: "green", tooltip: "Paid & Reconciled - 80%" },
                      { value: 15, color: "orange", tooltip: "Pending Reconciliation - 15%" },
                      { value: 5, color: "red", tooltip: "Overdue - 5%" },
                    ]}
                    label={
                      <Center>
                        <Text fw={700} size="xl">
                          80%
                        </Text>
                      </Center>
                    }
                  />
                </Center>
                <Text size="xs" c="dimmed" mt="md" ta="center">
                  Percentage of contributions fully processed this period.
                </Text>
              </Paper>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} size="h5" mb="md">
                  Quick Actions
                </Title>
                <Stack gap="sm">
                  <Button variant="light" leftSection={<IconFileText size={16} />}>
                    Generate IFRS Report
                  </Button>
                  <Button variant="light" leftSection={<IconReceipt size={16} />}>
                    View All Contributions
                  </Button>
                  <Button variant="light" leftSection={<IconMail size={16} />}>
                    Send Bulk Reminders
                  </Button>
                  <Button variant="light" leftSection={<IconUser size={16} />}>
                    Manage Employers
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}