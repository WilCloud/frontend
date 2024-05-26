import { zhCN, dateZhCN, enUS, dateEnUS, enGB, dateEnGB } from 'naive-ui';
import type { SelectOption } from 'naive-ui';

import {
  SunnyOutline,
  PartlySunnyOutline,
  MoonOutline,
} from '@vicons/ionicons5';

export const languages: Language[] = ['zh-CN', 'en-US', 'en-UK'] as const;

export const languageOptions: SelectOption[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-UK', label: 'English (UK)' },
] as const;

export const naiveuiLocale = {
  'zh-CN': [zhCN, dateZhCN],
  'en-US': [enUS, dateEnUS],
  'en-UK': [enGB, dateEnGB],
} as const;

export const languageOptionsMap = Object.fromEntries(
  languageOptions.map(item => [item.value, item.label])
);

export const themeOptionsNext = {
  light: 'dark',
  dark: 'auto',
  auto: 'light',
} as const;

export const themeOptionsIcon = {
  light: SunnyOutline,
  dark: MoonOutline,
  auto: PartlySunnyOutline,
} as const;
