import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in different bundler environments (Vite vs CRA/Webpack)
const getEnvVar = (craKey: string, viteKey: string): string | undefined => {
  // Check for Vite (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      // @ts-ignore
      if (import.meta.env[craKey]) return import.meta.env[craKey];
    }
  } catch (e) {
    // Ignore errors if import.meta is not available
  }

  // Check for Node/CRA (process.env)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      if (process.env[craKey]) return process.env[craKey];
      // @ts-ignore
      if (process.env[viteKey]) return process.env[viteKey];
    }
  } catch (e) {
    // Ignore errors if process is not available
  }

  return undefined;
};

const supabaseUrl = 'https://weeyxzxntupqiezcqcws.supabase.co';
const supabaseAnonKey = 'sb_publishable_ha2gMLn6-cQW6NxPvTIwUw_D47V89SQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getStorageUrl = (path: string) => {
  if (!path) return '';
  // Return as is if it's already a full URL or a blob/data URI
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
  
  // Strip leading slashes to prevent double slashes in the final URL
  const cleanPath = path.replace(/^\/+/, '');
  
  return `${supabaseUrl}/storage/v1/object/public/products/${cleanPath}`;
};