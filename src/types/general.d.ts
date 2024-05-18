type Language = 'zh' | 'en';

interface Response {
  status: string;
  message?: string;
  data: string | object | list;
}
