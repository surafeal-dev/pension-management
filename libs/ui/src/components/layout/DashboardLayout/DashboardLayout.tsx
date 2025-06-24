import React from 'react';
import {
  AppShell,
  Group,
  Text,
  Button,
  Avatar,
  NavLink as MantineNavLink,
  Box,
  rem,
  Menu,
} from '@mantine/core';
import {
  IconLogout,
  IconUser,
  IconHome,
  IconUsers,
  IconCash,
  IconClipboardList,
  IconApps,
  IconChevronDown,
  IconPigMoney,
  IconLoader2,
} from '@tabler/icons-react';
import { Link, useLocation, useNavigate, NavigateFunction } from 'react-router-dom';

const NAVBAR_WIDTH = 300;
const HEADER_HEIGHT = 60;

export interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  userMenu?: React.ReactNode;
  apps?: Array<{
    label: string;
    path: string;
    icon: React.ReactNode;
  }>;
  onLogout?: () => void;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
}

const defaultApps = [
  {
    label: 'Contribution',
    path: '/contribution',
    icon: <IconCash size={16} />,
  },
  {
    label: 'Finance',
    path: '/finance',
    icon: <IconPigMoney size={16} />,
  },
  {
    label: 'Registration',
    path: '/registration',
    icon: <IconCash size={16} />,
  },
];

const DefaultHeader = () => (
  <Text size="lg" fw={700}>
    Dashboard
  </Text>
);

const DefaultUserMenu = ({
  onLogout,
  user = { name: 'User' },
}: {
  onLogout?: () => void;
  user?: { name: string; email?: string; avatar?: string };
}) => (
  <Menu shadow="md" width={200}>
    <Menu.Target>
      <Button variant="subtle" px="xs">
        <Group gap="xs">
          {user.avatar ? (
            <Avatar src={user.avatar} size={30} radius="xl" />
          ) : (
            <Avatar color="blue" size={30} radius="xl">
              <IconUser size={16} />
            </Avatar>
          )}
          <Text size="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>Account</Menu.Label>
      <Menu.Item
        leftSection={<IconUser size={16} />}
        component={Link}
        to="/profile"
      >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        color="red"
        leftSection={<IconLogout size={16} />}
        onClick={onLogout}
      >
        Logout
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  const iconWithProps = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })
    : icon;

  return (
    <MantineNavLink
      component={Link}
      to={to}
      label={label}
      leftSection={iconWithProps}
      active={isActive}
      variant="subtle"
      p="sm"
      mb={4}
      styles={{
        root: {
          borderRadius: 'var(--mantine-radius-md)',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-0)',
            color: 'var(--mantine-color-blue-7)',
          },
          '&[data-active]': {
            backgroundColor: 'var(--mantine-color-blue-0)',
            color: 'var(--mantine-color-blue-7)',
            fontWeight: 600,
          },
        },
        label: {
          fontSize: 'var(--mantine-font-size-sm)',
          fontWeight: 500,
        },
      }}
    >
      {label}
    </MantineNavLink>
  );
};

export function DashboardLayout({
  children,
  headerContent = <DefaultHeader />,
  userMenu,
  apps = defaultApps,
  onLogout = () => {},
  user,
}: DashboardLayoutProps) {
  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const [isNavigating, setNavigating] = React.useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Handle navigation with loading state
  const handleNavigation = (path: string) => {
    setNavigating(true);
    navigate(path);
  };

  return (
    <AppShell
      padding="md"
      header={{
        height: HEADER_HEIGHT,
        offset: false,
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="md">{headerContent}</Group>

          <Group>
            {apps.length > 0 && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="light"
                    leftSection={<IconApps size={16} />}
                    rightSection={<IconChevronDown size={16} />}
                  >
                    Apps
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Applications</Menu.Label>
                  {apps.map((app) => (
                    <Menu.Item
                      key={app.path}
                      leftSection={app.icon}
                      onClick={() => handleNavigation(app.path)}
                      disabled={
                        isNavigating && location.pathname.startsWith(app.path)
                      }
                    >
                      {isNavigating &&
                      location.pathname.startsWith(app.path) ? (
                        <Group gap="xs">
                          <Text>{app.label}</Text>
                          <div className="animate-spin">
                            <IconLoader2 size={16} />
                          </div>
                        </Group>
                      ) : (
                        app.label
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
            {userMenu || (
              <DefaultUserMenu onLogout={handleLogout} user={user} />
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box p="md">{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
