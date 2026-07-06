import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhryztrbdmjtqnqbewck.supabase.co'
const supabaseKey = 'sb_publishable_oDBS4Qcs9VvJ3DNPobfLAA_XFUS8eKe'

export const supabase = createClient(supabaseUrl, supabaseKey)