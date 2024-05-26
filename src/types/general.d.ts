type Language = 'zh-CN' | 'en-US' | 'en-UK';

type Theme = 'light' | 'dark' | 'auto';

interface Response {
  status: string;
  message?: string;
  data: string | object | list;
}
