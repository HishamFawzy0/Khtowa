export interface UserDecodedToken {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
}