const { createClient } = require('@supabase/supabase-js');

const { SERVICE_ROLE_KEY, SUPABASE_URL } = process.env;

module.exports = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
