import { createClient } from '@supabase/supabase-js';

// Configuration based on provided details. 
// Note: In production, these should be in environment variables (process.env).
const SUPABASE_URL = 'https://lszmkcnvnzcywroqaaig.supabase.co';
// Using the ANON PUBLIC KEY (Safe for frontend). 
// The Service Role key provided in the prompt was ignored for security reasons.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzem1rY252bnpjeXdyb3FhYWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDIwNDksImV4cCI6MjA3MjE3ODA0OX0.JH4T1MHpAHnAOINJkuGU108UqQaalh_0M7dRcuqqc0s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Generic function to insert data into a Supabase table.
 * @param table The name of the table in Supabase
 * @param data The JSON object to insert
 * @returns The inserted data or throws an error
 */
export const saveRecord = async (table: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) {
      console.error(`Supabase Error inserting into ${table}:`, error);
      throw new Error(error.message);
    }

    return result;
  } catch (err) {
    console.error('Unexpected error in saveRecord:', err);
    throw err;
  }
};
