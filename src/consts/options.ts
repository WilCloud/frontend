export const languageOptions = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
];

export const languageOptionsMap = Object.fromEntries(
  languageOptions.map(item => [item.value, item.label])
);
