/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111111',
    background: '#ffffff',
    backgroundElement: '#F2F2F2',
    backgroundSelected: '#E95420',
    textSecondary: '#60646C',
    tint: '#E95420',
  },
  dark: {
    text: '#ffffff',
    background: '#111111',
    backgroundElement: '#181818',
    backgroundSelected: '#2A160F',
    textSecondary: '#AEA79F',
    tint: '#E95420',
  },
} as const;

export const CanonicalTheme = {
  jetBlack: '#111111',
  darkCharcoal: '#1E1E1E',
  cardSurface: '#181818',
  elevatedSurface: '#242424',
  border: '#2E2E2E',
  borderHighlight: '#444444',
  ubuntuOrange: '#E95420',
  orangeHover: '#FF6332',
  orangeDark: '#2A160F',
  warmGrey: '#AEA79F',
  lightGrey: '#E5E5E5',
  successGreen: '#38B44A',
  warningAmber: '#E95420',
  dangerRed: '#C7162B',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
