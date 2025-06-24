import {
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Avatar,
  rem,
} from '@mantine/core';
import { IconUsers, IconCash, IconClipboardList } from '@tabler/icons-react';

export function DashboardPage() {
  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      icon: <IconUsers size={24} />,
      color: 'blue',
    },
    {
      title: 'Total Contributions',
      value: '$45,231',
      icon: <IconCash size={24} />,
      color: 'green',
    },
    {
      title: 'Active Registrations',
      value: '789',
      icon: <IconClipboardList size={24} />,
      color: 'violet',
    },
  ];

  return (
    <div>
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {stats.map((stat) => (
          <Card key={stat.title} withBorder p="xl" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} lh={1}>
                  {stat.title}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
              </div>
              <Avatar size={44} color={stat.color} radius="md">
                {stat.icon}
              </Avatar>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}

export default DashboardPage;
