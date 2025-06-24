// File: apps/contribution/src/app/contribution-tracking.tsx
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
  ActionIcon,
  Badge,
  Menu,
  rem,
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { DataTable } from "mantine-datatable"
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconEye,
  IconAlertTriangle,
  IconCircleCheck,
  IconMail,
  IconFileImport,
} from "@tabler/icons-react"

const mockTrackingData = [
  { id: 1, employer: "TechCorp Inc.", period: "Oct 2024", amount: 55000, status: "Reconciled", submitted: "2024-11-02" },
  { id: 2, employer: "Innovate Solutions", period: "Oct 2024", amount: 32000, status: "Pending", submitted: "2024-11-01" },
  { id: 3, employer: "Global Imports", period: "Sep 2024", amount: 41000, status: "Overdue", submitted: null },
  { id: 4, employer: "HealthFirst Clinic", period: "Oct 2024", amount: 18500, status: "Discrepancy", submitted: "2024-11-01" },
  { id: 5, employer: "BuildRight LLC", period: "Oct 2024", amount: 78000, status: "Reconciled", submitted: "2024-10-28" },
]

const PAGE_SIZES = [10, 20, 30]

export default function ContributionTracking() {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState(mockTrackingData.slice(0, pageSize))

  const statusColors: Record<string, string> = {
    Reconciled: "green",
    Pending: "blue",
    Overdue: "red",
    Discrepancy: "orange",
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} size="h2" mb="xs">Contribution Tracking</Title>
          <Text c="dimmed" size="lg">Monitor, verify, and reconcile all incoming pension contributions.</Text>
        </div>

        <Group>
          <TextInput placeholder="Search employers..." leftSection={<IconSearch size={16} />} style={{ flex: 1 }} />
          <Select placeholder="Filter by status" data={["Reconciled", "Pending", "Overdue", "Discrepancy"]} leftSection={<IconFilter size={16} />} clearable />
          <DatePickerInput type="range" placeholder="Filter by submission date" w={280} />
          <Button>Search</Button>
          <Button variant="light" leftSection={<IconFileImport size={16} />}>Import Bank Statement</Button>
        </Group>

        <DataTable
          withTableBorder
          borderRadius="md"
          shadow="sm"
          striped
          highlightOnHover
          records={records}
          minHeight={200}
          totalRecords={mockTrackingData.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          onRecordsPerPageChange={setPageSize}
          recordsPerPageOptions={PAGE_SIZES}
          columns={[
            { accessor: "employer", title: "Employer", sortable: true },
            { accessor: "period", title: "Period", sortable: true, textAlign: "center" }, // <-- FIX: Changed to textAlign
            {
              accessor: "amount",
              title: "Amount",
              sortable: true,
              textAlign: "right", // <-- FIX: Changed to textAlign
              render: ({ amount }) => `$${amount.toLocaleString()}`,
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
            { accessor: "submitted", title: "Submitted On", sortable: true, textAlign: "center" }, // <-- FIX: Changed to textAlign
            {
              accessor: "actions",
              title: <Text>Actions</Text>,
              textAlign: "center", // <-- FIX: Changed to textAlign
              render: (record) => (
                <Group gap={4} justify="center" wrap="nowrap">
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray"><IconDotsVertical style={{ width: rem(16), height: rem(16) }} /></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>View Details</Menu.Item>
                      {record.status === "Discrepancy" && (<Menu.Item color="orange" leftSection={<IconAlertTriangle style={{ width: rem(14), height: rem(14) }} />}>Resolve Discrepancy</Menu.Item>)}
                      {record.status === "Pending" && (<Menu.Item color="green" leftSection={<IconCircleCheck style={{ width: rem(14), height: rem(14) }} />}>Mark as Reconciled</Menu.Item>)}
                      {record.status === "Overdue" && (<Menu.Item color="red" leftSection={<IconMail style={{ width: rem(14), height: rem(14) }} />}>Send Reminder</Menu.Item>)}
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