'use client';

import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ThemeIcon, useMantineColorScheme } from '@mantine/core';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <ThemeIcon variant='light' size={40} radius={'md'}>
      {colorScheme === 'light' ? (
        <IconMoonStars onClick={() => setColorScheme('dark')} />
      ) : (
        <IconSun onClick={() => setColorScheme('light')} />
      )}
    </ThemeIcon>
  );
}
