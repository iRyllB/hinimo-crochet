import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGIN') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function getCorsHeaders(request: Request) {
  const requestOrigin = request.headers.get('Origin')
  const allowOrigin = requestOrigin && allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0] ?? '*'

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    Vary: 'Origin',
  }
}

type ContactPayload = {
  name?: unknown
  email?: unknown
  message?: unknown
  captchaToken?: unknown
}

function jsonResponse(body: Record<string, string>, status: number, request: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(request) })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, request)
  }

  try {
    const payload = await request.json() as ContactPayload
    const name = typeof payload.name === 'string' ? payload.name.trim() : ''
    const email = typeof payload.email === 'string' ? payload.email.trim() : ''
    const message = typeof payload.message === 'string' ? payload.message.trim() : ''
    const captchaToken = typeof payload.captchaToken === 'string' ? payload.captchaToken : ''

    if (!name || name.length > 100 || !email || email.length > 320 || !message || message.length > 5000 || !captchaToken) {
      return jsonResponse({ error: 'Please provide valid contact details and complete the CAPTCHA.' }, 400, request)
    }

    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!turnstileSecret || !supabaseUrl || !serviceRoleKey) {
      console.error('Missing required submit-contact-message secrets.')
      return jsonResponse({ error: 'The contact form is temporarily unavailable.' }, 500, request)
    }

    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: turnstileSecret, response: captchaToken }),
    })
    const verificationResult = await verification.json() as { success?: boolean }
    if (!verification.ok || !verificationResult.success) {
      return jsonResponse({ error: 'CAPTCHA verification failed. Please try again.' }, 400, request)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { error } = await supabase.from('contact_messages').insert({ name, email, message })
    if (error) {
      console.error('Failed to store contact message:', error)
      return jsonResponse({ error: 'Your note could not be sent. Please try again later.' }, 500, request)
    }

    return jsonResponse({ message: 'Contact message submitted.' }, 200, request)
  } catch (error) {
    console.error('Unexpected contact form error:', error)
    return jsonResponse({ error: 'Invalid request.' }, 400, request)
  }
})
