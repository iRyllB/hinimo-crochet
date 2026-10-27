    
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variable.')
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  status: 'unread' | 'read' | 'archived'
  created_at: string
}

export async function submitContactMessage(input: Pick<ContactMessage, 'name' | 'email' | 'message'>) {
  const { error } = await supabase.from('contact_messages').insert(input)
  if (error) throw error
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, status, created_at')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ContactMessage[]
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']) {
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
  if (error) throw error
}