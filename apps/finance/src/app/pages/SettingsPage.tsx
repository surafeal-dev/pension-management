import React from 'react';
import { 
  Title, 
  Text,
  Stack,
  Container,
  Paper,
  Switch,
  TextInput,
  Button,
  Divider
} from '@mantine/core';

const SettingsPage = () => {
  return (
    <Container size="lg">
      <Stack gap="xl">
        <Title order={2} fw={700} mb="md">Settings</Title>
        
        <Paper withBorder p="xl" radius="md">
          <Stack gap="md">
            <Title order={4}>Account Preferences</Title>
            
            <TextInput
              label="Email Address"
              defaultValue="john.doe@example.com"
              placeholder="Your email address"
            />
            
            <Switch 
              label="Email notifications" 
              description="Receive email notifications about account activity"
              defaultChecked
            />
            
            <Switch 
              label="Monthly statement" 
              description="Receive monthly pension statement via email"
              defaultChecked
            />
            
            <Divider my="md" />
            
            <Title order={4}>Security</Title>
            
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Enable Two-Factor Authentication</Button>
            
            <Divider my="md" />
            
            <Button>Save Changes</Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
