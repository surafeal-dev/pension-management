import { useState, useMemo } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Group, 
  Stack, 
  Paper, 
  TextInput, 
  NumberInput, 
  Slider, 
  Divider,
  Switch,
  Badge,
  Box,
  rem,
  Button,
  ActionIcon,
  Tooltip,
  Tabs,
  SimpleGrid
} from '@mantine/core';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Label
} from 'recharts';
import { 
  IconCalculator, 
  IconInfoCircle, 
  IconRefresh, 
  IconChartLine,
  IconCurrencyDollar,
  IconPercentage,
  IconCalendar,
  IconTarget
} from '@tabler/icons-react';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format large numbers
const formatLargeNumber = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
};

// Function to calculate retirement projections
const calculateProjections = (inputs: {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  inflationRate: number;
  salary: number;
  salaryIncrease: number;
  employerMatch: number;
  employerMatchCap: number;
  includeSocialSecurity: boolean;
  socialSecurityBenefit: number;
  socialSecurityStartAge: number;
  retirementSpending: number;
  lifeExpectancy: number;
}) => {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    inflationRate,
    salary,
    salaryIncrease,
    employerMatch,
    employerMatchCap,
    includeSocialSecurity,
    socialSecurityBenefit,
    socialSecurityStartAge,
    retirementSpending,
    lifeExpectancy
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const totalYears = Math.max(yearsToRetirement + yearsInRetirement, 30);
  
  const data = [];
  let savings = currentSavings;
  let currentSalary = salary;
  
  // Calculate savings until retirement
  for (let age = currentAge; age <= currentAge + totalYears; age++) {
    const year = age - currentAge;
    const isWorking = age < retirementAge;
    let yearContribution = 0;
    
    if (isWorking) {
      // Calculate employer match (capped at a percentage of salary)
      const maxEmployerMatch = currentSalary * (employerMatchCap / 100);
      const actualEmployerMatch = Math.min(
        monthlyContribution * 12 * (employerMatch / 100),
        maxEmployerMatch
      );
      
      yearContribution = monthlyContribution * 12 + actualEmployerMatch;
      
      // Apply salary increase for next year
      if (age < retirementAge - 1) {
        currentSalary *= 1 + (salaryIncrease / 100);
      }
    } else {
      // In retirement, withdraw the specified amount
      const withdrawal = retirementSpending * (1 + (inflationRate / 100)) ** (age - retirementAge);
      yearContribution = -withdrawal;
      
      // Add Social Security if applicable
      if (includeSocialSecurity && age >= socialSecurityStartAge) {
        const ssBenefit = socialSecurityBenefit * (1 + (inflationRate / 100)) ** (age - socialSecurityStartAge);
        yearContribution += ssBenefit;
      }
    }
    
    // Calculate growth on current savings
    const growth = savings * (annualReturn / 100);
    const previousSavings = savings;
    savings = Math.max(0, savings + yearContribution + growth);
    
    data.push({
      age,
      year,
      savings: Math.round(savings),
      contributions: Math.round(yearContribution > 0 ? yearContribution : 0),
      withdrawals: Math.round(yearContribution < 0 ? -yearContribution : 0),
      growth: Math.round(growth),
      isWorking: age < retirementAge,
      isRetired: age >= retirementAge,
      socialSecurity: includeSocialSecurity && age >= socialSecurityStartAge 
        ? Math.round(socialSecurityBenefit * (1 + (inflationRate / 100)) ** (age - socialSecurityStartAge))
        : 0,
      retirementSpending: age >= retirementAge 
        ? Math.round(retirementSpending * (1 + (inflationRate / 100)) ** (age - retirementAge))
        : 0
    });
    
    // Stop if we run out of money
    if (savings <= 0 && age > retirementAge) {
      break;
    }
  }
  
  // Calculate summary metrics
  const retirementData = data.find(d => d.age === retirementAge);
  const endData = data[data.length - 1];
  const yearsOfRetirementFunded = Math.max(0, data.filter(d => d.isRetired && d.savings > 0).length);
  
  return {
    data,
    summary: {
      totalSavingsAtRetirement: retirementData?.savings || 0,
      finalSavings: endData?.savings || 0,
      yearsOfRetirementFunded,
      ranOutOfMoney: yearsOfRetirementFunded < yearsInRetirement,
      safeWithdrawalRate: retirementData ? (retirementSpending / retirementData.savings * 100).toFixed(1) : '0.0',
      totalContributions: data.reduce((sum, d) => sum + (d.contributions || 0), 0),
      totalWithdrawals: data.reduce((sum, d) => sum + (d.withdrawals || 0), 0),
      totalGrowth: data.reduce((sum, d) => sum + (d.growth || 0), 0),
    }
  };
};

export const RetirementProjections = () => {
  // Input states with defaults
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(150000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [salary, setSalary] = useState(80000);
  const [salaryIncrease, setSalaryIncrease] = useState(2.5);
  const [employerMatch, setEmployerMatch] = useState(50);
  const [employerMatchCap, setEmployerMatchCap] = useState(6);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [retirementSpending, setRetirementSpending] = useState(50000);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState(true);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(25000);
  const [socialSecurityStartAge, setSocialSecurityStartAge] = useState(67);
  
  // Calculate projections
  const { data, summary } = useMemo(() => calculateProjections({
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    inflationRate,
    salary,
    salaryIncrease,
    employerMatch,
    employerMatchCap,
    includeSocialSecurity,
    socialSecurityBenefit,
    socialSecurityStartAge,
    retirementSpending,
    lifeExpectancy
  }), [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    salary,
    salaryIncrease,
    employerMatch,
    employerMatchCap,
    annualReturn,
    inflationRate,
    retirementSpending,
    includeSocialSecurity,
    socialSecurityBenefit,
    socialSecurityStartAge
  ]);
  
  // Calculate years until retirement
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Calculate required savings rate
  const requiredMonthlySavings = useMemo(() => {
    if (yearsToRetirement <= 0) return 0;
    
    const futureValue = retirementSpending * (1 - 1 / Math.pow(1 + (annualReturn / 100), yearsInRetirement)) / (annualReturn / 100);
    const presentValue = futureValue / Math.pow(1 + (annualReturn / 100), yearsToRetirement);
    const requiredSavings = (presentValue - currentSavings) / yearsToRetirement / 12;
    
    return Math.max(0, requiredSavings);
  }, [currentSavings, retirementSpending, yearsToRetirement, yearsInRetirement, annualReturn]);
  
  // Reset to defaults
  const resetToDefaults = () => {
    setCurrentAge(35);
    setRetirementAge(65);
    setLifeExpectancy(90);
    setCurrentSavings(150000);
    setMonthlyContribution(1000);
    setSalary(80000);
    setSalaryIncrease(2.5);
    setEmployerMatch(50);
    setEmployerMatchCap(6);
    setAnnualReturn(6);
    setInflationRate(2.5);
    setRetirementSpending(50000);
    setIncludeSocialSecurity(true);
    setSocialSecurityBenefit(25000);
    setSocialSecurityStartAge(67);
  };

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>
          <Group gap="xs">
            <IconCalculator size={20} />
            Retirement Projections
          </Group>
        </Title>
        <Button 
          variant="light" 
          size="xs" 
          leftSection={<IconRefresh size={16} />}
          onClick={resetToDefaults}
        >
          Reset to Defaults
        </Button>
      </Group>
      
      <Stack gap="lg">
        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">Projected Savings at Retirement</Text>
            <Title order={3} fw={700} mt="xs">
              {formatCurrency(summary.totalSavingsAtRetirement)}
            </Title>
            <Text size="xs" c="dimmed" mt={4}>
              Age {retirementAge}
            </Text>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              {summary.ranOutOfMoney ? 'Funds Last Until' : 'Projected Savings at Age'}
            </Text>
            <Title order={3} fw={700} mt="xs" c={summary.ranOutOfMoney ? 'red' : undefined}>
              {summary.ranOutOfMoney 
                ? `Age ${retirementAge + summary.yearsOfRetirementFunded}` 
                : formatCurrency(summary.finalSavings)}
            </Title>
            <Text size="xs" c={summary.ranOutOfMoney ? 'red' : 'dimmed'} mt={4}>
              {summary.ranOutOfMoney 
                ? `Only ${summary.yearsOfRetirementFunded} of ${yearsInRetirement} years funded`
                : `Age ${lifeExpectancy}`}
            </Text>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Recommended Monthly Savings</Text>
              <Tooltip label="Based on your current inputs and target retirement spending">
                <ActionIcon variant="transparent" size="xs" color="gray">
                  <IconInfoCircle size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Title order={3} fw={700} mt="xs" c={monthlyContribution < requiredMonthlySavings ? 'orange' : 'green'}>
              {formatCurrency(requiredMonthlySavings)}
            </Title>
            <Text size="xs" c={monthlyContribution < requiredMonthlySavings ? 'orange' : 'dimmed'} mt={4}>
              Current: {formatCurrency(monthlyContribution)}/mo
            </Text>
          </Paper>
        </SimpleGrid>
        
        {/* Main Chart */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Retirement Projection</Text>
            <Badge variant="light" color={summary.ranOutOfMoney ? 'red' : 'green'}>
              {summary.ranOutOfMoney ? 'At Risk' : 'On Track'}
            </Badge>
          </Group>
          
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-gray-2)" />
                <XAxis 
                  dataKey="age" 
                  tick={{ fill: 'var(--mantine-color-dimmed)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`} 
                  tick={{ fill: 'var(--mantine-color-dimmed)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Savings']}
                  labelFormatter={(label) => `Age ${label}`}
                  contentStyle={{
                    backgroundColor: 'var(--mantine-color-body)',
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-md)',
                    padding: 'var(--mantine-spacing-sm)'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => (
                    <Text size="xs" c="dimmed">
                      {value}
                    </Text>
                  )}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  name="Projected Savings" 
                  stroke="var(--mantine-color-blue-6)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <ReferenceLine 
                  x={retirementAge} 
                  stroke="var(--mantine-color-orange-6)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label 
                    value="Retirement" 
                    position="insideTopRight" 
                    fill="var(--mantine-color-orange-6)"
                    style={{ fontSize: 12 }}
                  />
                </ReferenceLine>
                {summary.ranOutOfMoney && (
                  <ReferenceLine 
                    x={retirementAge + summary.yearsOfRetirementFunded}
                    stroke="var(--mantine-color-red-6)"
                    strokeWidth={1}
                  >
                    <Label 
                      value="Funds Depleted" 
                      position="insideTopRight" 
                      fill="var(--mantine-color-red-6)"
                      style={{ fontSize: 12 }}
                    />
                  </ReferenceLine>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Paper>
        
        {/* Input Controls */}
        <Tabs defaultValue="savings">
          <Tabs.List>
            <Tabs.Tab value="savings" leftSection={<IconCurrencyDollar size={16} />}>
              Savings & Investments
            </Tabs.Tab>
            <Tabs.Tab value="retirement" leftSection={<IconTarget size={16} />}>
              Retirement Goals
            </Tabs.Tab>
            <Tabs.Tab value="advanced" leftSection={<IconChartLine size={16} />}>
            Advanced
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="savings" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <NumberInput
                label="Current Age"
                value={currentAge}
                onChange={(value) => setCurrentAge(Number(value) || 0)}
                min={18}
                max={100}
                leftSection={<IconCalendar size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    yrs
                  </Text>
                }
              />
              
              <NumberInput
                label="Current Retirement Savings"
                value={currentSavings}
                onChange={(value) => setCurrentSavings(Number(value) || 0)}
                min={0}
                leftSection={<IconCurrencyDollar size={16} />}
                thousandSeparator=","
                prefix="$"
              />
              
              <NumberInput
                label="Annual Salary"
                value={salary}
                onChange={(value) => setSalary(Number(value) || 0)}
                min={0}
                leftSection={<IconCurrencyDollar size={16} />}
                thousandSeparator=","
                prefix="$"
              />
              
              <NumberInput
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={(value) => setMonthlyContribution(Number(value) || 0)}
                min={0}
                leftSection={<IconCurrencyDollar size={16} />}
                thousandSeparator=","
                prefix="$"
              />
              
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>Employer Match</Text>
                  <Badge variant="light" color="blue">
                    {employerMatch}% up to {employerMatchCap}% of salary
                  </Badge>
                </Group>
                <Group grow>
                  <NumberInput
                    value={employerMatch}
                    onChange={(value) => setEmployerMatch(Number(value) || 0)}
                    min={0}
                    max={100}
                    leftSection={<IconPercentage size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed" w={24} ta="center">
                        %
                      </Text>
                    }
                  />
                  <NumberInput
                    value={employerMatchCap}
                    onChange={(value) => setEmployerMatchCap(Number(value) || 0)}
                    min={0}
                    max={100}
                    leftSection={<IconPercentage size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed" w={24} ta="center">
                        % of salary
                      </Text>
                    }
                  />
                </Group>
              </div>
              
              <NumberInput
                label="Annual Salary Increase"
                value={salaryIncrease}
                onChange={(value) => setSalaryIncrease(Number(value) || 0)}
                min={0}
                max={20}
                leftSection={<IconPercentage size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    %
                  </Text>
                }
              />
            </SimpleGrid>
          </Tabs.Panel>
          
          <Tabs.Panel value="retirement" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <NumberInput
                label="Planned Retirement Age"
                value={retirementAge}
                onChange={(value) => setRetirementAge(Number(value) || 0)}
                min={currentAge + 1}
                max={100}
                leftSection={<IconCalendar size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    yrs
                  </Text>
                }
              />
              
              <NumberInput
                label="Life Expectancy"
                value={lifeExpectancy}
                onChange={(value) => setLifeExpectancy(Number(value) || 0)}
                min={retirementAge + 1}
                max={120}
                leftSection={<IconCalendar size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    yrs
                  </Text>
                }
              />
              
              <NumberInput
                label="Annual Retirement Spending"
                value={retirementSpending}
                onChange={(value) => setRetirementSpending(Number(value) || 0)}
                min={0}
                leftSection={<IconCurrencyDollar size={16} />}
                thousandSeparator=","
                prefix="$"
              />
              
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>Include Social Security</Text>
                  <Switch 
                    checked={includeSocialSecurity} 
                    onChange={(e) => setIncludeSocialSecurity(e.currentTarget.checked)}
                    size="sm"
                  />
                </Group>
                
                {includeSocialSecurity && (
                  <SimpleGrid cols={2} spacing="md">
                    <NumberInput
                      label="Annual Benefit"
                      value={socialSecurityBenefit}
                      onChange={(value) => setSocialSecurityBenefit(Number(value) || 0)}
                      min={0}
                      leftSection={<IconCurrencyDollar size={16} />}
                      thousandSeparator=","
                      prefix="$"
                    />
                    
                    <NumberInput
                      label="Start Age"
                      value={socialSecurityStartAge}
                      onChange={(value) => setSocialSecurityStartAge(Number(value) || 0)}
                      min={62}
                      max={70}
                      leftSection={<IconCalendar size={16} />}
                      rightSection={
                        <Text size="xs" c="dimmed" w={24} ta="center">
                          yrs
                        </Text>
                      }
                    />
                  </SimpleGrid>
                )}
              </div>
            </SimpleGrid>
          </Tabs.Panel>
          
          <Tabs.Panel value="advanced" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <NumberInput
                label="Annual Return on Investment"
                value={annualReturn}
                onChange={(value) => setAnnualReturn(Number(value) || 0)}
                min={0}
                max={30}
                step={0.1}
                leftSection={<IconPercentage size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    %
                  </Text>
                }
              />
              
              <NumberInput
                label="Inflation Rate"
                value={inflationRate}
                onChange={(value) => setInflationRate(Number(value) || 0)}
                min={0}
                max={20}
                step={0.1}
                leftSection={<IconPercentage size={16} />}
                rightSection={
                  <Text size="xs" c="dimmed" w={24} ta="center">
                    %
                  </Text>
                }
              />
              
              <div>
                <Text size="sm" fw={500} mb={4}>Safe Withdrawal Rate</Text>
                <Paper p="md" withBorder>
                  <Text size="sm" c="dimmed" mb={4}>
                    At retirement, you'll withdraw {formatCurrency(retirementSpending)} annually
                  </Text>
                  <Text size="sm" c="dimmed">
                    This is a <Text span fw={700}>{summary.safeWithdrawalRate}%</Text> withdrawal rate from your projected savings of {formatCurrency(summary.totalSavingsAtRetirement)}
                  </Text>
                </Paper>
              </div>
              
              <div>
                <Text size="sm" fw={500} mb={4}>Projection Summary</Text>
                <Paper p="md" withBorder>
                  <Text size="sm" c="dimmed" mb={4}>
                    {yearsToRetirement} years until retirement
                  </Text>
                  <Text size="sm" c="dimmed" mb={4}>
                    {yearsInRetirement} years in retirement
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total contributions: {formatCurrency(summary.totalContributions)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total growth: {formatCurrency(summary.totalGrowth)}
                  </Text>
                </Paper>
              </div>
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Card>
  );
};

export default RetirementProjections;
