import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://akgtiynbvgkeagcbkvpq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZ3RpeW5idmdrZWFnY2JrdnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDgyNTksImV4cCI6MjA2MTc4NDI1OX0.e1dUbloMWzsim-grnt6HBaPa6fqKD3mFiW6kx-f2kXc";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
