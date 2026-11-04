    
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

export type Product = {
  id: string
  name: string
  description: string
  price: number
  color: 'pink' | 'yellow' | 'green' | 'coral'
  image_url: string | null
  created_at: string
  updated_at: string
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

export async function deleteContactMessage(id: string) {
  const { data, error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('No contact message was deleted. Check the Supabase DELETE policy and user session.')
  }
}

export async function getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, color, image_url, created_at, updated_at')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Product[]
  }

export async function createProduct(input: Pick<Product, 'name' | 'description' | 'price' | 'color' | 'image_url'>) {
    const { data, error } = await supabase.from('products').insert(input).select().single()
    if (error) throw error
    return data as Product
  }

export async function updateProduct(id: string, input: Partial<Pick<Product, 'name' | 'description' | 'price' | 'color' | 'image_url'>>) {
    const { data, error } = await supabase.from('products').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data as Product
  }

export async function deleteProduct(id: string) {
    const { data, error } = await supabase.from('products').delete().eq('id', id).select('id')
    if (error) throw error
    if (!data || data.length === 0) throw new Error('No product was deleted.')
  }

export async function uploadProductImage(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
}