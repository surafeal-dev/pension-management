// File: apps/contribution/src/app/contributions-layout.tsx
"use client"

import { AppShell, Burger, Group, NavLink, Text, Title, Menu, Avatar, rem } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconGauge,
  IconChartPie, // Make sure this icon is imported
  IconFileAnalytics,
  IconReceipt,
  IconReportMoney,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react"
import * as React from "react";
import { Link, Route, Routes, useResolvedPath, useMatch } from "react-router-dom";

// Import all the pages you have created
import AdminDashboard from "./admin-dashboard"
import ContributionAnalytics from "./contribution-analytics" // Ensure this is imported
import EmployerSubmissionPortal from "./employer-submission-portal"
import ContributionTracking from "./contribution-tracking"
import PenaltyManagement from "./penalty-management"

// Define the navigation links in an array for easy management
const navLinks = [
  {
    label: "Admin Dashboard",
    to: "/contribution",
    icon: <IconGauge size="1rem" stroke={1.5} />,
  },
  {
    label: "Contribution Analytics",
    to: "/contribution/analytics",
    icon: <IconChartPie size="1rem" stroke={1.5} />,
  },
  {
    label: "Contribution Tracking",
    to: "/contribution/tracking",
    icon: <IconFileAnalytics size="1rem" stroke={1.5} />,
  },
  {
    label: "Employer Submission",
    to: "/contribution/submission",
    icon: <IconReceipt size="1rem" stroke={1.5} />,
  },
  {
    label: "Penalty Management",
    to: "/contribution/penalties",
    icon: <IconReportMoney size="1rem" stroke={1.5} />,
  },
];

// Custom NavLink that uses React Router hooks to determine active state
function CustomNavLink({ label, to, icon }: { label: string; to: string; icon: React.ReactNode }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <NavLink
      component={Link}
      to={to}
      label={label}
      leftSection={icon}
      active={!!match}
      variant="filled"
    />
  );
}

// This component is a child of ContributionsLayout, so it's safely inside the Router context.
function MainNavigation() {
  return navLinks.map((link) => <CustomNavLink key={link.label} {...link} />);
}

export default function ContributionsLayout() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Pensions System</Title>
          </Group>
          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group style={{ cursor: "pointer" }} gap="xs">
                  <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                    radius="xl"
                  />
                  <Text size="sm" fw={500}>
                    Admin User
                  </Text>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                  Settings
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text tt="uppercase" size="xs" c="dimmed" fw={500} mb="sm">
          Contributions
        </Text>
        <MainNavigation />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<ContributionAnalytics />} />
          <Route path="tracking" element={<ContributionTracking />} />
          <Route path="submission" element={<EmployerSubmissionPortal />} />
          <Route path="penalties" element={<PenaltyManagement />} />
          <Route path="*" element={<Title>404: Page Not Found</Title>} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  )
}