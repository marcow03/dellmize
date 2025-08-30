'use client';

import { IconInfoCircle } from '@tabler/icons-react';
import {
  AppShell,
  Flex,
  Group,
  HoverCard,
  Kbd,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ProcessingArea } from './ProcessingArea';
import { ThemeToggle } from './ThemeToggle';

export function Home() {
  return (
    <AppShell>
      <AppShell.Header p={'md'}>
        <Flex justify={'space-between'} flex={'row'} align="center">
          <Title order={1}>DeLLMize</Title>
          <Group>
            <ThemeToggle />
            <HoverCard>
              <HoverCard.Target>
                <ThemeIcon variant="light" size={40} radius={'md'}>
                  <IconInfoCircle />
                </ThemeIcon>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Stack>
                  <Text size="sm">
                    <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>V</Kbd>: Paste Input from Clipboard
                    <br />
                    <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>C</Kbd>: Copy Output to Clipboard
                  </Text>
                </Stack>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Main pt={100} pb={100}>
        <ProcessingArea />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Flex justify="space-between" align="center">
          <div style={{ textAlign: 'start' }}>© 2025 DeLLMize</div>
          <Text size="sm">
            <a
              href="https://github.com/marcow03/dellmize"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              github.com/marcow03/dellmize
            </a>
          </Text>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
