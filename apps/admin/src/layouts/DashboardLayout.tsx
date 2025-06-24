// import React from 'react';
// import {
//   AppShell,
//   Group,
//   Text,
//   Button,
//   Avatar,
//   NavLink as MantineNavLink,
//   Box,
//   rem,
//   Menu,
// } from '@mantine/core';
// import {
//   IconLogout,
//   IconUser,
//   IconHome,
//   IconUsers,
//   IconCash,
//   IconClipboardList,
//   IconApps,
//   IconChevronDown,
//   IconPigMoney,
// } from '@tabler/icons-react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';

// const NAVBAR_WIDTH = 300;
// const HEADER_HEIGHT = 60;

// interface NavItemProps {
//   to: string;
//   label: string;
//   icon: React.ReactNode;
//   active: boolean;
// }

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   headerContent?: React.ReactNode;
//   userMenu?: React.ReactNode;
// }

// const apps = [
//   {
//     label: 'Contribution',
//     path: '/contribution',
//     icon: <IconCash size={16} />,
//   },
//   { label: 'Finance', path: '/finance', icon: <IconPigMoney size={16} /> },
//   {
//     label: 'Registration',
//     path: '/registration',
//     icon: <IconUser size={16} />,
//   },
// ];

// // Default header content
// const DefaultHeader = () => (
//   <Text size="lg" fw={700}>
//     Pension Admin
//   </Text>
// );

// // Default user menu
// const DefaultUserMenu = ({ onLogout }: { onLogout: () => void }) => (
//   <Menu shadow="md" width={200}>
//     <Menu.Target>
//       <Button variant="subtle" px="xs">
//         <Group gap="xs">
//           <Avatar color="blue" size={30} radius="xl">
//             <IconUser size={16} />
//           </Avatar>
//           <Text size="sm" fw={500}>
//             Admin
//           </Text>
//         </Group>
//       </Button>
//     </Menu.Target>
//     <Menu.Dropdown>
//       <Menu.Label>Account</Menu.Label>
//       <Menu.Item
//         leftSection={<IconUser size={16} />}
//         component={Link}
//         to="/profile"
//       >
//         Profile
//       </Menu.Item>
//       <Menu.Divider />
//       <Menu.Item
//         color="red"
//         leftSection={<IconLogout size={16} />}
//         onClick={onLogout}
//       >
//         Logout
//       </Menu.Item>
//     </Menu.Dropdown>
//   </Menu>
// );

// export function DashboardLayout({
//   children,
//   headerContent = <DefaultHeader />,
//   userMenu,
// }: DashboardLayoutProps) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     navigate('/login');
//   };

//   const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active }) => (
//     <MantineNavLink
//       component={Link}
//       to={to}
//       label={label}
//       leftSection={icon}
//       active={active}
//       style={{ borderRadius: 'var(--mantine-radius-sm)' }}
//       styles={{
//         root: {
//           '&:h': {
//             backgroundColor: 'var(--mantine-color-gray-1)',
//           },
//         },
//       }}
//     />
//   );

//   return (
//     <AppShell
//       padding="md"
//       header={{
//         height: HEADER_HEIGHT,
//         offset: false,
//       }}
//     >
//       <AppShell.Header>
//         <Group h="100%" px="md" justify="space-between">
//           <Group gap="md">{headerContent}</Group>

//           <Group>
//             <Menu shadow="md" width={200}>
//               <Menu.Target>
//                 <Button
//                   variant="light"
//                   leftSection={<IconApps size={16} />}
//                   rightSection={<IconChevronDown size={16} />}
//                 >
//                   Apps
//                 </Button>
//               </Menu.Target>
//               <Menu.Dropdown>
//                 <Menu.Label>Micro-frontend Apps</Menu.Label>
//                 {apps.map((app) => (
//                   <Menu.Item
//                     key={app.path}
//                     leftSection={app.icon}
//                     component={Link}
//                     to={app.path}
//                   >
//                     {app.label}
//                   </Menu.Item>
//                 ))}
//               </Menu.Dropdown>
//             </Menu>
//             {userMenu || <DefaultUserMenu onLogout={handleLogout} />}
//           </Group>
//         </Group>
//       </AppShell.Header>

//       <AppShell.Main>
//         <Box p="md">{children}</Box>
//       </AppShell.Main>
//     </AppShell>
//   );
// }

// export default DashboardLayout;
