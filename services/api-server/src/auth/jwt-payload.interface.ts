export interface JwtPayload {
    email: string;
    sub: string; // This will be the user ID (or any unique identifier for the user)
  }
  