
export interface User {
  access?: string;
  refresh?: string;
  uid?: number;
  username?: string;
  first_name?:string;
  last_name?:string;
  email?:string;
  password?:string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login?: (data: User) => Promise<User>;
  logout?: () => void;
  signup?: (data:FormData) => Promise<void>;
  loading?: boolean;
  error: string | null;
}
