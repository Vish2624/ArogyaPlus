export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AdminProfileUpdatePayload {
  email?: string;
  current_password?: string;
  new_password?: string;
}
