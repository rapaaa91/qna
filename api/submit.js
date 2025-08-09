import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or anon key is not set in environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message field is required' })
    }

    // Insert message ke table "messages" di Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content: message }])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Database insert failed', detail: error.message })
    }

    return res.status(200).json({ status: 'success', message: data[0] })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
