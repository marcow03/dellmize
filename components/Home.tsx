'use client';

import { IconBrandGithubFilled } from '@tabler/icons-react';
import { AppShell, Container, Flex, ThemeIcon, Title } from '@mantine/core';
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
      <AppShell.Main pt={100}>
        <ProcessingArea />
      </AppShell.Main>
      <AppShell.Footer p="md">
        <Flex justify={'space-between'} flex={'row'} align="center">
          <Container>© 2025 DeLLMize</Container>
          <ThemeIcon variant="default" radius={'xl'} size={40}>
            <a
              href="https://github.com/marcow03/dellmize"
              style={{ color: 'inherit', textDecoration: 'none', margin: 0, padding: 0 }}
            >
              <IconBrandGithubFilled></IconBrandGithubFilled>
            </a>
          </ThemeIcon>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
