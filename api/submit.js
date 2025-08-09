import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Message is required' })

  const { data, error } = await supabase.from('messages').insert([{ content: message }]).select()

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json({ status: 'success', message: data[0] })
}
