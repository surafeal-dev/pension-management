import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Paper,
  Stack,
  rem,
  Alert,
  Box,
  Divider,
  Group,
  Image,
  Flex,
  Space,
} from '@mantine/core';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { IconLock, IconMail, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { isAuthenticated, login, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) =>
        value.length < 3 ? 'Username must be at least 3 characters' : null,
      password: (value: string) =>
        value.length < 4 ? 'Password must be at least 6 characters' : null,
    },
  });

  // If user is already authenticated, redirect them to registration or their intended destination
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/registration';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      setLoginError(null);
      await login(values.username, values.password);
      // No need to navigate here, the AuthProvider will handle it

      // If authentication fails, throw an error
      // throw new Error('Invalid credentials');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <Container
      size={1200}
      p={0}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        style={{ width: '80%', maxWidth: '1000px', overflow: 'hidden' }}
      >
        <Flex>
          {/* Left Side - Welcome Section */}
          <Box
            w="40%"
            bg="dark.8"
            p="xl"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '500px',
            }}
          >
            <Title
              order={1}
              c="white"
              style={{ fontSize: rem(28), marginBottom: rem(16) }}
            >
              Welcome to Pension Management
              <Divider
                my="sm"
                color="white"
                size="sm"
                style={{ width: '40px' }}
              />
            </Title>
            <Text c="white" mb={30} size="sm">
              web based pension management system
            </Text>
            <Button
              variant="outline"
              color="white"
              style={{
                borderWidth: 2,
                width: 'fit-content',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Know More
            </Button>

            {/* Decorative elements */}
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                right: '-80px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1,
              }}
            />
          </Box>

          {/* Right Side - Login Form */}
          <Box
            w="60%"
            p="xl"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box maw={400} w="100%" py={40}>
              <Title
                order={1}
                style={{
                  fontSize: rem(28),
                  marginBottom: rem(24),
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#333',
                }}
              >
                Sign In
                <Divider
                  my="sm"
                  color="#333"
                  size="sm"
                  style={{ width: '40px', margin: '8px auto 0' }}
                />
              </Title>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    placeholder="Enter your email address"
                    variant="unstyled"
                    size="md"
                    rightSection={<IconMail size={18} color="#999" />}
                    styles={
                      {
                        input: {
                          borderBottom: '1px solid #ddd',
                          borderRadius: 0,
                          padding: '8px 0',
                          fontSize: '0.95rem',
                          ':focus': {
                            borderColor: '#000',
                            borderWidth: '1px',
                            boxShadow: 'none',
                          },
                          '::placeholder': {
                            color: '#999',
                            opacity: 1,
                          },
                        },
                        section: {
                          marginRight: 0,
                        },
                      } as any
                    }
                    {...form.getInputProps('username')}
                  />

                  <PasswordInput
                    placeholder="Enter password"
                    variant="unstyled"
                    size="md"
                    rightSection={<IconLock size={18} color="#999" />}
                    styles={
                      {
                        input: {
                          borderBottom: '1px solid #ddd',
                          borderRadius: 0,
                          padding: '8px 0',
                          fontSize: '0.95rem',
                          ':focus': {
                            borderColor: '#000',
                            borderWidth: '1px',
                            boxShadow: 'none',
                          },
                          '::placeholder': {
                            color: '#999',
                            opacity: 1,
                          },
                        },
                        innerInput: {
                          '::placeholder': {
                            color: '#999',
                            opacity: 1,
                          },
                        },
                        section: {
                          marginRight: 0,
                        },
                      } as any
                    }
                    {...form.getInputProps('password')}
                  />

                  {loginError && (
                    <Alert
                      icon={<IconAlertCircle size="1rem" />}
                      title="Error!"
                      color="red"
                      variant="light"
                      mt="xs"
                      p="xs"
                    >
                      {loginError}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    size="md"
                    loading={loading}
                    fullWidth
                    mt="lg"
                    style={{
                      backgroundColor: '#000',
                      height: '44px',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                      ':hover': {
                        backgroundColor: '#333',
                      },
                      marginTop: rem(30),
                    }}
                  >
                    LOGIN
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        </Flex>
      </Paper>
    </Container>
  );
}

export default LoginPage;
