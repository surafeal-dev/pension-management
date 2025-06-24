// File: apps/contribution/src/app/penalty-management.tsx
"use client"

import { useState } from "react"
import {
  Container,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Select,
  TextInput,
  Badge,
  Menu,
  rem,
  ActionIcon,
  Modal,
  Textarea,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { DataTable } from "mantine-datatable"
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconCircleCheck,
  IconSend,
  IconHandOff,
  IconReceipt,
} from "@tabler/icons-react"

const mockPenaltyData = [
  {
    id: 1,
    employer: "Global Imports",
    amount: 410.5,
    reason: "Late submission (3 days)",
    status: "Outstanding",
    date: "2024-10-18",
  },
  {
    id: 2,
    employer: "Creative Minds Agency",
    amount: 250.0,
    reason: "Incorrect amount",
    status: "Outstanding",
    date: "2024-10-15",
  },
  {
    id: 3,
    employer: "BuildRight LLC",
    amount: 500.0,
    reason: "Late submission (5 days)",
    status: "Paid",
    date: "2024-09-20",
  },
  {
    id: 4,
    employer: "Fast Logistics",
    amount: 150.0,
    reason: "Late submission (1 day)",
    status: "Waived",
    date: "2024-09-16",
  },
]

export default function PenaltyManagement() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedPenalty, setSelectedPenalty] = useState<any>(null)

  const statusColors: Record<string, string> = {
    Outstanding: "red",
    Paid: "green",
    Waived: "gray",
  }

  const handleWaiveClick = (penalty: any) => {
    setSelectedPenalty(penalty)
    open()
  }

  return (
    <Container size="xl" py="xl">
      <Modal opened={opened} onClose={close} title={`Waive Penalty for ${selectedPenalty?.employer}`}>
        <Stack>
          <Text>
            You are about to waive a penalty of{" "}
            <Text span fw={700}>
              ${selectedPenalty?.amount.toFixed(2)}
            </Text>{" "}
            for {selectedPenalty?.employer}.
          </Text>
          <Textarea label="Reason for Waiver" placeholder="e.g., First-time offense, system error..." required />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button color="orange" onClick={close}>
              Confirm Waiver
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack gap="lg">
        <div>
          <Title order={1} size="h2" mb="xs">
            Penalty Management
          </Title>
          <Text c="dimmed" size="lg">
            Track and manage penalties for contribution breaches.
          </Text>
        </div>

        {/* Filters */}
        <Group>
          <TextInput placeholder="Search employers..." leftSection={<IconSearch size={16} />} style={{ flex: 1 }} />
          <Select
            placeholder="Filter by status"
            data={["Outstanding", "Paid", "Waived"]}
            leftSection={<IconFilter size={16} />}
            clearable
          />
          <Button>Search</Button>
        </Group>

        {/* Data Table */}
        <DataTable
          withTableBorder
          borderRadius="md"
          shadow="sm"
          records={mockPenaltyData}
          minHeight={200}
          columns={[
            { accessor: "employer", title: "Employer", sortable: true },
            { accessor: "date", title: "Offense Date", sortable: true },
            { accessor: "reason", title: "Reason" },
            {
              accessor: "amount",
              title: "Amount",
              sortable: true,
              textAlign: "right", // <-- FIX: Changed to textAlign
              render: ({ amount }) => `$${amount.toFixed(2)}`,
            },
            {
              accessor: "status",
              title: "Status",
              textAlign: "center", // <-- FIX: Changed to textAlign
              render: ({ status }) => (
                <Badge color={statusColors[status]} variant="light">
                  {status}
                </Badge>
              ),
            },
            {
              accessor: "actions",
              title: <Text>Actions</Text>,
              textAlign: "center", // <-- FIX: Changed to textAlign
              render: (record) => (
                <Group gap={4} justify="center" wrap="nowrap">
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {record.status === "Outstanding" && (
                        <>
                          <Menu.Item leftSection={<IconReceipt style={{ width: rem(14), height: rem(14) }} />}>
                            Mark as Paid
                          </Menu.Item>
                          <Menu.Item
                            color="orange"
                            leftSection={<IconHandOff style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => handleWaiveClick(record)}
                          >
                            Request Waiver
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="blue"
                            leftSection={<IconSend style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Send Penalty Notification
                          </Menu.Item>
                        </>
                      )}
                      {record.status !== "Outstanding" && (
                        <Menu.Item leftSection={<IconCircleCheck style={{ width: rem(14), height: rem(14) }} />}>
                          View History
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ),
            },
          ]}
        />
      </Stack>
    </Container>
  )
}