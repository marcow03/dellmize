'use client';

import { AppShell, Flex, Title } from '@mantine/core';
import { ProcessingArea } from './ProcessingArea';
import { ThemeToggle } from './ThemeToggle';

export function Home() {
  return (
    <AppShell p={'md'}>
      <AppShell.Header p={'md'}>
        <Flex justify={'space-between'} flex={'row'} align="center">
          <Title order={1}>DeLLMize</Title>
          <ThemeToggle />
        </Flex>
      </AppShell.Header>

      <AppShell.Main pt={100}>
        <ProcessingArea />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Flex justify={'space-between'} flex={'row'} align="center">
          <div>Logo</div>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
