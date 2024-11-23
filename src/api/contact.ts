import { supabase } from '@/lib/supabase'

export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
}) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        created_at: new Date().toISOString(),
      },
    ])

  if (error) {
    throw error
  }

  return data
}
