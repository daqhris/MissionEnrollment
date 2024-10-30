import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string(),
  NEXT_PUBLIC_CDP_API_KEY: z.string(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string(),
});

export const ENV = envSchema.parse({
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_CDP_API_KEY: process.env.NEXT_PUBLIC_CDP_API_KEY,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
});

export function validateEnv() {
  try {
    envSchema.parse(ENV);
    console.log('[ENV] Environment variables validated successfully');
  } catch (error) {
    console.error('[ENV] Environment validation failed:', error);
    throw new Error('Environment validation failed');
  }
}