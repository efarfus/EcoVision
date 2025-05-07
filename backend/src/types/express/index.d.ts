import { Request } from 'express';

export * from 'express-serve-static-core'

declare module 'express-serve-static-core' {
  type TestError = 123;
  interface Request {
    userId?: string; 
  }

  
}
