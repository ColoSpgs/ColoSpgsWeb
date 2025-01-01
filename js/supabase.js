// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Initialize Supabase client
const supabaseUrl = 'https://waetozwbzglsgtlqmemv.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZXRvendiemdsc2d0bHFtZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyOTExMTEsImV4cCI6MjAzNzg2NzExMX0.X8sK40GzOpxvefXkm43yOSRG-Bn4IIUba0MJ7eaBwuo'

const supabase = createClient(supabaseUrl, supabaseKey)

// Make supabase available globally
window.supabase = supabase

export default supabase
