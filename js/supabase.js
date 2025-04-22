import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://dwhtftluyvfukuuagcyy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aHRmdGx1eXZmdWt1dWFnY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODM2OTYsImV4cCI6MjA2MDg1OTY5Nn0.bcZFsB4tvBGMdlC7v3_AqMpMZLznuHFVqSKpVvAv4gs'
export const supabase = createClient(supabaseUrl, supabaseKey)