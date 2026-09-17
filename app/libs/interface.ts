export interface UserInfo {
    id: string;
    email: string;
    name: string;
    contactPhone: string;
    role: string;
  }
  
  export interface AuthState {
    user: UserInfo | null;
    authentificated: boolean;
    loading: boolean;
    errorMessage: string | null;
  }
  
  export interface RootState {
    auth: AuthState;
  }