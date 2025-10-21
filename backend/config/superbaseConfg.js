import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.project_url
const SUPABASE_SERVICE_ROLE_KEY = process.env.service_role

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

