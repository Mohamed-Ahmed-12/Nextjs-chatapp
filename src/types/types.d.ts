
export interface User {
  access: string;
  refresh: string;
  uid:string;
  username:string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login?: (username: string, password: string) => Promise<User>;
  logout?: () => void;
  register?: (email: string, password: string, username?: string) => Promise<void>;
  loading?: boolean;
}
