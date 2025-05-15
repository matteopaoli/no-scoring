import 'express';

declare global {
  namespace Express {
    interface User {
      sub: string;
      // other custom claims if needed
    }
  }
}