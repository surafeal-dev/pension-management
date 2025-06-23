import { useState, useMemo } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Group, 
  Stack, 
  Paper, 
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
  SimpleGrid,
  Tabs,
  Table
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
  Label,
  BarChart,
  Bar
} from 'recharts';
import { 
  IconCalculator, 
  IconInfoCircle, 
  IconRefresh, 
  IconChartLine,
  IconCurrencyDollar,
  IconPercentage,
  IconCalendar,
  IconTarget,
  IconZoomIn,
  IconZoomOut,
  IconTable
} from '@tabler/icons-react';
import { parse } from 'path';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to calculate inflation-adjusted values
const calculateInflationAdjusted = (amount: number, inflationRate: number, years: number) => {
  return amount * Math.pow(1 + (inflationRate / 100), years);
};

// Function to calculate withdrawal strategy
const calculateWithdrawalStrategy = (inputs: {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  annualReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  socialSecurityBenefit: number;
  socialSecurityStartAge: number;
  includeSocialSecurity: boolean;
  includeTaxes: boolean;
  taxRate: number;
}) => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    annualReturn,
    inflationRate,
    withdrawalRate,
    socialSecurityBenefit,
    socialSecurityStartAge,
    includeSocialSecurity,
    includeTaxes,
    taxRate
  } = inputs;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const totalYears = yearsToRetirement + yearsInRetirement;
  
  const data = [];
  let savings = currentSavings;
  let currentWithdrawal = 0;
  
  // Calculate savings until retirement
  for (let age = currentAge; age <= currentAge + totalYears; age++) {
    const year = age - currentAge;
    const isWorking = age < retirementAge;
    const isRetired = age >= retirementAge;
    
    let withdrawal = 0;
    let socialSecurity = 0;
    let taxes = 0;
    
    if (isRetired) {
      // Calculate base withdrawal amount
      if (age === retirementAge) {
        // First year of retirement, calculate initial withdrawal
        currentWithdrawal = savings * (withdrawalRate / 100);
      } else {
        // Adjust withdrawal for inflation
        currentWithdrawal *= (1 + (inflationRate / 100));
      }
      
      // Get social security if eligible
      if (includeSocialSecurity && age >= socialSecurityStartAge) {
        socialSecurity = calculateInflationAdjusted(
          socialSecurityBenefit, 
          inflationRate, 
          age - socialSecurityStartAge
        );
      }
      
      // Calculate taxes if applicable
      if (includeTaxes) {
        const taxableIncome = currentWithdrawal + (includeSocialSecurity && age >= socialSecurityStartAge ? socialSecurity * 0.85 : 0);
        taxes = taxableIncome * (taxRate / 100);
      }
      
      // Total withdrawal (after taxes and social security)
      withdrawal = Math.min(currentWithdrawal, savings);
      const netWithdrawal = withdrawal - taxes + socialSecurity;
      
      // Add to data
      data.push({
        age,
        year,
        savings: Math.round(savings),
        withdrawal: Math.round(withdrawal),
        socialSecurity: Math.round(socialSecurity),
        taxes: Math.round(taxes),
        netIncome: Math.round(netWithdrawal),
        withdrawalRate: (withdrawal / savings * 100).toFixed(1),
        isWorking,
        isRetired
      });
      
      // Update savings for next year
      const growth = savings * (annualReturn / 100);
      savings = Math.max(0, savings - withdrawal + growth);
      
    } else {
      // Still working, just track savings growth
      const growth = savings * (annualReturn / 100);
      savings += growth;
      
      data.push({
        age,
        year,
        savings: Math.round(savings),
        withdrawal: 0,
        socialSecurity: 0,
        taxes: 0,
        netIncome: 0,
        withdrawalRate: 0,
        isWorking: true,
        isRetired: false
      });
    }
    
    // Stop if we've reached life expectancy
    if (age >= lifeExpectancy) break;
  }
  
  // Find the year when savings run out
  const depletionYear = data.findIndex(d => d.savings <= 0 && d.isRetired);
  const yearsFunded = depletionYear === -1 
    ? yearsInRetirement 
    : depletionYear - yearsToRetirement;
  
  // Calculate summary metrics
  const retirementData = data.find(d => d.age === retirementAge);
  const finalData = data[data.length - 1];
  
  // Ensure we have valid numbers for the summary
  const initialWithdrawalRate = typeof retirementData?.withdrawalRate === 'number' 
    ? retirementData.withdrawalRate 
    : parseFloat(String(retirementData?.withdrawalRate || '0'));
    
  const finalWithdrawalRate = typeof finalData?.withdrawalRate === 'number'
    ? finalData.withdrawalRate 
    : parseFloat(String(finalData?.withdrawalRate || '0'));

  return {
    data,
    summary: {
      initialWithdrawal: retirementData?.withdrawal || 0,
      initialWithdrawalRate,
      finalWithdrawal: finalData?.withdrawal || 0,
      finalWithdrawalRate,
      yearsFunded,
      ranOutOfMoney: yearsFunded < yearsInRetirement,
      totalWithdrawn: data.reduce((sum, d) => sum + (d.withdrawal || 0), 0),
      totalTaxes: data.reduce((sum, d) => sum + (d.taxes || 0), 0),
      totalSocialSecurity: data.reduce((sum, d) => sum + (d.socialSecurity || 0), 0),
      finalSavings: finalData?.savings || 0
    }
  };
};

export const WithdrawalPlanner = () => {
  // Input states with defaults
  const [currentAge, setCurrentAge] = useState(55);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(1000000);
  const [annualReturn, setAnnualReturn] = useState(5);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState(true);
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState(30000);
  const [socialSecurityStartAge, setSocialSecurityStartAge] = useState(67);
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [taxRate, setTaxRate] = useState(22);
  const [timeframe, setTimeframe] = useState(30); // Years to show in the chart
  
  // Calculate withdrawal strategy
  const { data, summary } = useMemo(() => calculateWithdrawalStrategy({
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    annualReturn,
    inflationRate,
    withdrawalRate,
    socialSecurityBenefit,
    socialSecurityStartAge,
    includeSocialSecurity,
    includeTaxes,
    taxRate
  }), [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    annualReturn,
    inflationRate,
    withdrawalRate,
    socialSecurityBenefit,
    socialSecurityStartAge,
    includeSocialSecurity,
    includeTaxes,
    taxRate
  ]);
  
  // Filter data for the selected timeframe
  const filteredData = useMemo(() => {
    const retirementYear = data.findIndex(d => d.isRetired);
    const startYear = Math.max(0, retirementYear - 5);
    const endYear = Math.min(data.length, retirementYear + timeframe);
    return data.slice(startYear, endYear);
  }, [data, timeframe]);
  
  // Calculate years until retirement
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Reset to defaults
  const resetToDefaults = () => {
    setCurrentAge(55);
    setRetirementAge(65);
    setLifeExpectancy(90);
    setCurrentSavings(1000000);
    setAnnualReturn(5);
    setInflationRate(2.5);
    setWithdrawalRate(4);
    setIncludeSocialSecurity(true);
    setSocialSecurityBenefit(30000);
    setSocialSecurityStartAge(67);
    setIncludeTaxes(true);
    setTaxRate(22);
    setTimeframe(30);
  };

  return (
    <Card withBorder p="md" radius="md" mt="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>
          <Group gap="xs">
            <IconCalculator size={20} />
            Withdrawal Strategy Planner
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
            <Text size="sm" c="dimmed">Initial Withdrawal</Text>
            <Title order={3} fw={700} mt="xs">
              {formatCurrency(summary.initialWithdrawal)}
            </Title>
            <Text size="xs" c="dimmed" mt={4}>
              {withdrawalRate}% of initial savings
            </Text>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              {summary.ranOutOfMoney ? 'Funds Last Until' : 'Projected Savings at'}
            </Text>
            <Title 
              order={3} 
              fw={700} 
              mt="xs" 
              c={summary.ranOutOfMoney ? 'red' : undefined}
            >
              {summary.ranOutOfMoney 
                ? `Age ${retirementAge + summary.yearsFunded}` 
                : formatCurrency(summary.finalSavings)}
            </Title>
            <Text size="xs" c={summary.ranOutOfMoney ? 'red' : 'dimmed'} mt={4}>
              {summary.ranOutOfMoney 
                ? `Only ${summary.yearsFunded} of ${yearsInRetirement} years funded`
                : `Age ${lifeExpectancy}`}
            </Text>
          </Paper>
          
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Withdrawal Rate</Text>
              <Badge 
                color={
                  summary.initialWithdrawalRate < 4 ? 'green' : 
                  summary.initialWithdrawalRate < 5 ? 'yellow' : 'red'
                }
                variant="light"
              >
                {summary.initialWithdrawalRate.toFixed(1)}%
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              {summary.initialWithdrawalRate < 4 
                ? 'Conservative (4% rule)' 
                : summary.initialWithdrawalRate < 5 
                  ? 'Moderate risk' 
                  : 'Aggressive (higher risk of depletion)'}
            </Text>
          </Paper>
        </SimpleGrid>
        
        {/* Main Chart */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Withdrawal Strategy Projection</Text>
            <Group gap="xs">
              <ActionIcon 
                variant="light" 
                size="sm"
                onClick={() => setTimeframe(prev => Math.max(10, prev - 5))}
                disabled={timeframe <= 10}
              >
                <IconZoomOut size={16} />
              </ActionIcon>
              <Text size="sm" c="dimmed">
                {timeframe} years
              </Text>
              <ActionIcon 
                variant="light" 
                size="sm"
                onClick={() => setTimeframe(prev => Math.min(50, prev + 5))}
                disabled={timeframe >= 50}
              >
                <IconZoomIn size={16} />
              </ActionIcon>
            </Group>
          </Group>
          
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData.filter(d => d.isRetired)}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
                barGap={0}
                barCategoryGap={0}
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
                  width={60}
                />
                <RechartsTooltip 
                  formatter={(value: any, name: string) => {
                    const formattedValue = formatCurrency(Number(value));
                    switch(name) {
                      case 'withdrawal': return [formattedValue, 'Withdrawal'];
                      case 'socialSecurity': return [formattedValue, 'Social Security'];
                      case 'taxes': return [formattedValue, 'Taxes'];
                      case 'netIncome': return [formattedValue, 'Net Income'];
                      default: return [formattedValue, name];
                    }
                  }}
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
                <Bar 
                  dataKey="withdrawal" 
                  name="Withdrawal" 
                  stackId="a" 
                  fill="var(--mantine-color-blue-6)"
                  radius={[0, 0, 0, 0]}
                />
                {includeSocialSecurity && (
                  <Bar 
                    dataKey="socialSecurity" 
                    name="Social Security" 
                    stackId="a" 
                    fill="var(--mantine-color-green-6)"
                    radius={[0, 0, 0, 0]}
                  />
                )}
                {includeTaxes && (
                  <Bar 
                    dataKey="taxes" 
                    name="Taxes" 
                    stackId="a" 
                    fill="var(--mantine-color-red-6)"
                    radius={[0, 0, 0, 0]}
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="netIncome" 
                  name="Net Income"
                  stroke="var(--mantine-color-violet-6)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <ReferenceLine 
                  x={socialSecurityStartAge} 
                  stroke="var(--mantine-color-orange-6)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label 
                    value="SS Starts" 
                    position="insideTopRight" 
                    fill="var(--mantine-color-orange-6)"
                    style={{ fontSize: 12 }}
                  />
                </ReferenceLine>
                {summary.ranOutOfMoney && (
                  <ReferenceLine 
                    x={retirementAge + summary.yearsFunded}
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
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <Group justify="space-between" mt="md">
            <Text size="xs" c="dimmed">
              Projections assume a {annualReturn}% annual return and {inflationRate}% inflation rate.
            </Text>
            <Badge 
              variant="light" 
              color={summary.ranOutOfMoney ? 'red' : 'green'}
              leftSection={
                <Box mr={4}>
                  {summary.ranOutOfMoney ? '⚠️' : '✅'}
                </Box>
              }
            >
              {summary.ranOutOfMoney 
                ? `Funds may run out at age ${retirementAge + summary.yearsFunded}`
                : `Funds should last until age ${lifeExpectancy}`}
            </Badge>
          </Group>
        </Paper>
        
        {/* Input Controls */}
        <Tabs defaultValue="withdrawals">
          <Tabs.List>
            <Tabs.Tab value="withdrawals" leftSection={<IconCurrencyDollar size={16} />}>
              Withdrawals
            </Tabs.Tab>
            <Tabs.Tab value="taxes" leftSection={<IconPercentage size={16} />}>
              Taxes & Social Security
            </Tabs.Tab>
            <Tabs.Tab value="scenarios" leftSection={<IconChartLine size={16} />}>
              Scenarios
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="withdrawals" pt="md">
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
                label="Current Retirement Savings"
                value={currentSavings}
                onChange={(value) => setCurrentSavings(Number(value) || 0)}
                min={0}
                leftSection={<IconCurrencyDollar size={16} />}
                thousandSeparator=","
                prefix="$"
               
              />
              
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>Initial Withdrawal Rate</Text>
                  <Badge 
                    variant="light" 
                    color={
                      withdrawalRate < 4 ? 'green' : 
                      withdrawalRate < 5 ? 'yellow' : 'red'
                    }
                  >
                    {withdrawalRate}%
                  </Badge>
                </Group>
                <Slider
                  value={withdrawalRate}
                  onChange={setWithdrawalRate}
                  min={1}
                  max={10}
                  step={0.1}
                  marks={[
                    { value: 2, label: '2%' },
                    { value: 4, label: '4%' },
                    { value: 6, label: '6%' },
                    { value: 8, label: '8%' },
                    { value: 10, label: '10%' },
                  ]}
                />
                <Group justify="space-between" mt={4}>
                  <Text size="xs" c="dimmed">Conservative</Text>
                  <Text size="xs" c="dimmed">Aggressive</Text>
                </Group>
              </div>
              
              <NumberInput
                label="Expected Annual Return"
                value={annualReturn}
                onChange={(value) => setAnnualReturn(Number(value) || 0)}
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
              
              <NumberInput
                label="Expected Inflation Rate"
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
            </SimpleGrid>
          </Tabs.Panel>
          
          <Tabs.Panel value="taxes" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <div>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>Include Taxes</Text>
                  <Switch 
                    checked={includeTaxes} 
                    onChange={(e) => setIncludeTaxes(e.currentTarget.checked)}
                    size="sm"
                  />
                </Group>
                
                {includeTaxes && (
                  <NumberInput
                    label="Effective Tax Rate"
                    value={taxRate}
                    onChange={(value) => setTaxRate(Number(value) || 0)}
                    min={0}
                    max={50}
                    step={0.1}
                    leftSection={<IconPercentage size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed" w={24} ta="center">
                        %
                      </Text>
                    }
                  />
                )}
              </div>
              
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
                  <>
                    <NumberInput
                      label="Annual Social Security Benefit"
                      value={socialSecurityBenefit}
                      onChange={(value) => setSocialSecurityBenefit(Number(value) || 0)}
                      min={0}
                      leftSection={<IconCurrencyDollar size={16} />}
                      thousandSeparator=","
                      prefix="$"
                    />
                    
                    <NumberInput
                      label="Start Receiving at Age"
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
                      mt="md"
                    />
                  </>
                )}
              </div>
            </SimpleGrid>
          </Tabs.Panel>
          
          <Tabs.Panel value="scenarios" pt="md">
            <Paper withBorder p="md" radius="md">
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Scenario Analysis - Coming Soon
              </Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Card>
  );
};

export default WithdrawalPlanner;
