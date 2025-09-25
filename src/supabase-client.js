import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "https://yvkarmklzwhfkqrzrybd.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2a2FybWtsendoZmtxcnpyeWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjI3OTUsImV4cCI6MjA3NDI5ODc5NX0.qlK_4NNUQCrB8PHQsSBLw3J6WofgI1248x8ZcYfAT-M"

export const supabase = createClient(supabaseUrl, supabaseKey)