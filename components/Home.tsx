'use client';

import { IconBrandGithubFilled } from '@tabler/icons-react';
import { AppShell, Container, Flex, Group, ThemeIcon, Title } from '@mantine/core';
import { ProcessingArea } from './ProcessingArea';
import { ThemeToggle } from './ThemeToggle';

export function Home() {
  return (
    <AppShell>
      <AppShell.Header p={'md'}>
        <Flex justify={'space-between'} flex={'row'} align="center">
          <Title order={1}>DeLLMize</Title>
          <ThemeToggle />
        </Flex>
      </AppShell.Header>
      <AppShell.Main pt={100} pb={100}>
        <ProcessingArea />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Flex justify="space-between" align="center">
          <div style={{ textAlign: 'start' }}>© 2025 DeLLMize</div>
          <div>
            <ThemeIcon variant="default" radius={'xl'} size={40}>
              <a
                href="https://github.com/marcow03/dellmize"
                style={{ color: 'inherit', textDecoration: 'none', margin: 0, padding: 0 }}
              >
                <IconBrandGithubFilled></IconBrandGithubFilled>
              </a>
            </ThemeIcon>
          </div>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
