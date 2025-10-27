'use client';

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/button';
import { useCallback, useEffect, useState } from 'react';
import VisuallyHidden from './visually-hidden';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const applyTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  }, []);

  const cycleTheme = useCallback(() => {
    let newTheme: 'light' | 'dark' | 'system';

    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    setTheme(newTheme);
    applyTheme(newTheme);

    // Save preference
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    if (!mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      return;
    }

    // Check for saved theme preference or default to system
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    // Apply initial theme
    applyTheme(savedTheme || 'system');
  }, []);



  if (!mounted) {
    return (
      <Button outline className="w-9 h-9 p-0">
        <SunIcon className="h-4 w-4" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-4 w-4" title='light mode' />;
      case 'dark':
        return <MoonIcon className="h-4 w-4 dark:stroke-white dark:fill-white" title='dark mode' />;
      default:
        return <ComputerDesktopIcon className="h-4 w-4 dark:stroke-white dark:fill-white" title='system mode' />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      default:
        return 'System mode';
    }
  };

  return (
    <Button
      outline
      onClick={cycleTheme}
      aria-label={getLabel()}
      className="w-9 h-9 p-0"
    >
      <VisuallyHidden>{getLabel()}</VisuallyHidden>
      {getIcon()}
    </Button>
  );
}
