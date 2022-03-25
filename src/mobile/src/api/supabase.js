import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const ANON_KEY = Constants.manifest.extra.supabaseKey;
const SUPABASE_URL = Constants.manifest.extra.supabaseUrl;

console.log('SUPABASE_URL', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});

export default supabase;
