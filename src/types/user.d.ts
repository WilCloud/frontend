interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  is_superuser: boolean;
  preference: Object;
  totp: boolean | null;
  date_joined?: string;
}
