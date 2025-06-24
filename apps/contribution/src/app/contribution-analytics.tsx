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
  ActionIcon,
  Select,
  Button,
  Container,
  NumberFormatter,
  Progress,
  RingProgress,
  Center,
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { LineChart, BarChart } from "@mantine/charts"
import {
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconDownload,
  IconFilter,
} from "@tabler/icons-react"
import { useState } from "react"

// Mock data for the analytics
const mockData = {
  expectedYearlyPayout: 125000,
  unfulfilledContribution: 15000,
  expectedYearlyContribution: 48000,
  missedContribution: 8500,
  contributionRate: 85,
  payoutGrowth: 12.5,
}

// Mock chart data
const contributionTrendData = [
  { month: "Jan", expected: 4000, actual: 3800, missed: 200 },
  { month: "Feb", expected: 4000, actual: 4000, missed: 0 },
  { month: "Mar", expected: 4000, actual: 3500, missed: 500 },
  { month: "Apr", expected: 4000, actual: 4200, missed: 0 },
  { month: "May", expected: 4000, actual: 3900, missed: 100 },
  { month: "Jun", expected: 4000, actual: 4100, missed: 0 },
  { month: "Jul", expected: 4000, actual: 3600, missed: 400 },
  { month: "Aug", expected: 4000, actual: 4000, missed: 0 },
  { month: "Sep", expected: 4000, actual: 3750, missed: 250 },
  { month: "Oct", expected: 4000, actual: 4050, missed: 0 },
  { month: "Nov", expected: 4000, actual: 3900, missed: 100 },
  { month: "Dec", expected: 4000, actual: 4000, missed: 0 },
]

const payoutProjectionData = [
  { year: "2024", amount: 125000 },
  { year: "2025", amount: 140000 },
  { year: "2026", amount: 157000 },
  { year: "2027", amount: 176000 },
  { year: "2028", amount: 198000 },
  { year: "2029", amount: 222000 },
  { year: "2030", amount: 250000 },
]

const contributionBreakdownData = [
  { name: "Regular Contributions", value: 75, color: "blue" },
  { name: "Catch-up Contributions", value: 15, color: "green" },
  { name: "Missed Contributions", value: 10, color: "red" },
]

export default function ContributionAnalytics() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [chartType, setChartType] = useState("line")
  const [selectedPeriod, setSelectedPeriod] = useState("yearly")

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} size="h2" mb="xs">
              Contribution Analytics
            </Title>
            <Text c="dimmed" size="lg">
              Monitor your pension contributions and projected payouts
            </Text>
          </div>
          <Group>
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Export Report
            </Button>
          </Group>
        </Group>

        {/* Key Metrics Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Expected Yearly Payout
                </Text>
                <IconTrendingUp size={20} color="green" />
              </Group>
              <Text fw={700} size="xl" c="green">
                <NumberFormatter value={mockData.expectedYearlyPayout} prefix="$" thousandSeparator />
              </Text>
              <Group mt="md" gap="xs">
                <Badge color="green" variant="light" size="sm">
                  +{mockData.payoutGrowth}%
                </Badge>
                <Text size="xs" c="dimmed">
                  vs last year
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Expected Yearly Contribution
                </Text>
                <IconCalendar size={20} color="blue" />
              </Group>
              <Text fw={700} size="xl" c="blue">
                <NumberFormatter value={mockData.expectedYearlyContribution} prefix="$" thousandSeparator />
              </Text>
              <Progress value={mockData.contributionRate} mt="md" size="sm" color="blue" />
              <Text size="xs" c="dimmed" mt="xs">
                {mockData.contributionRate}% completed
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Unfulfilled Contribution
                </Text>
                <IconTrendingDown size={20} color="orange" />
              </Group>
              <Text fw={700} size="xl" c="orange">
                <NumberFormatter value={mockData.unfulfilledContribution} prefix="$" thousandSeparator />
              </Text>
              <Text size="xs" c="dimmed" mt="md">
                Remaining to meet target
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Missed Contribution
                </Text>
                <IconAlertTriangle size={20} color="red" />
              </Group>
              <Text fw={700} size="xl" c="red">
                <NumberFormatter value={mockData.missedContribution} prefix="$" thousandSeparator />
              </Text>
              <Badge color="red" variant="light" size="sm" mt="md">
                Requires Attention
              </Badge>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Charts Section */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="lg">
                <div>
                  <Title order={3} size="h4">
                    Contribution Trends
                  </Title>
                  <Text size="sm" c="dimmed">
                    Track your contribution performance over time
                  </Text>
                </div>
                <Group>
                  <Select
                    placeholder="Chart Type"
                    data={[
                      { value: "line", label: "Line Chart" },
                      { value: "bar", label: "Bar Chart" },
                    ]}
                    value={chartType}
                    onChange={(value) => setChartType(value || "line")}
                    size="sm"
                  />
                  <Select
                    placeholder="Period"
                    data={[
                      { value: "monthly", label: "Monthly" },
                      { value: "quarterly", label: "Quarterly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                    value={selectedPeriod}
                    onChange={(value) => setSelectedPeriod(value || "monthly")}
                    size="sm"
                  />
                </Group>
              </Group>

              <Group mb="md">
                <DatePickerInput
                  type="range"
                  placeholder="Select date range"
                  value={dateRange}
                  onChange={(value) =>
                    setDateRange([
                      value[0] ? new Date(value[0]) : null,
                      value[1] ? new Date(value[1]) : null,
                    ])
                  }
                  leftSection={<IconCalendar size={16} />}
                  size="sm"
                />
                <ActionIcon variant="light" size="sm">
                  <IconFilter size={16} />
                </ActionIcon>
              </Group>

              {chartType === "line" ? (
                <LineChart
                  h={300}
                  data={contributionTrendData}
                  dataKey="month"
                  series={[
                    { name: "expected", color: "blue.6", label: "Expected" },
                    { name: "actual", color: "green.6", label: "Actual" },
                    { name: "missed", color: "red.6", label: "Missed" },
                  ]}
                  curveType="linear"
                  gridAxis="xy"
                  withLegend
                  legendProps={{ verticalAlign: "bottom", height: 50 }}
                />
              ) : (
                <BarChart
                  h={300}
                  data={contributionTrendData}
                  dataKey="month"
                  series={[
                    { name: "expected", color: "blue.6", label: "Expected" },
                    { name: "actual", color: "green.6", label: "Actual" },
                    { name: "missed", color: "red.6", label: "Missed" },
                  ]}
                  withLegend
                  legendProps={{ verticalAlign: "bottom", height: 50 }}
                />
              )}
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} size="h5" mb="md">
                  Contribution Breakdown
                </Title>
                <Center>
                  <RingProgress
                    size={180}
                    thickness={16}
                    sections={[
                      { value: 75, color: "blue", tooltip: "Regular Contributions - 75%" },
                      { value: 15, color: "green", tooltip: "Catch-up Contributions - 15%" },
                      { value: 10, color: "red", tooltip: "Missed Contributions - 10%" },
                    ]}
                    label={
                      <Center>
                        <div>
                          <Text ta="center" fw={700} size="lg">
                            85%
                          </Text>
                          <Text ta="center" size="xs" c="dimmed">
                            Completion Rate
                          </Text>
                        </div>
                      </Center>
                    }
                  />
                </Center>
                <Stack gap="xs" mt="md">
                  {contributionBreakdownData.map((item) => (
                    <Group key={item.name} justify="space-between">
                      <Group gap="xs">
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: `var(--mantine-color-${item.color}-6)`,
                          }}
                        />
                        <Text size="sm">{item.name}</Text>
                      </Group>
                      <Text size="sm" fw={500}>
                        {item.value}%
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>

              <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} size="h5" mb="md">
                  Payout Projection
                </Title>
                <LineChart
                  h={200}
                  data={payoutProjectionData}
                  dataKey="year"
                  series={[{ name: "amount", color: "violet.6" }]}
                  curveType="monotone"
                  withDots={false}
                  gridAxis="y"
                />
                <Text size="xs" c="dimmed" mt="xs" ta="center">
                  Projected annual payout growth
                </Text>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Summary Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} size="h5" mb="md">
                Performance Summary
              </Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">Contribution Consistency</Text>
                  <Badge color="green" variant="light">
                    Good
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Target Achievement</Text>
                  <Badge color="blue" variant="light">
                    85%
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Risk Level</Text>
                  <Badge color="yellow" variant="light">
                    Moderate
                  </Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} size="h5" mb="md">
                Recommendations
              </Title>
              <Stack gap="sm">
                <Text size="sm">• Consider increasing monthly contributions by $200 to meet yearly target</Text>
                <Text size="sm">• Set up automatic contributions to avoid missed payments</Text>
                <Text size="sm">• Review catch-up contribution opportunities for tax benefits</Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}
