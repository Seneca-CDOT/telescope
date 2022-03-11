import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, anonKey } from './config';

const supabase = createClient(supabaseUrl!, anonKey!);

export default supabase;
