import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

// Interfaces matching database tables
interface ContactSubmission {
  name: string
  email: string
  message: string
}

interface BillVote {
  bill_id: string
  user_id?: string
  vote: string
  comment: string
}

export async function submitContactForm(data: ContactSubmission) {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        message: data.message,
        created_at: new Date().toISOString()
      }])

    if (error) {
      toast.error('Failed to submit contact form')
      throw error
    }

    toast.success('Contact form submitted successfully!')
    return true
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

export async function submitBillVote(data: BillVote) {
  try {
    // Validate required fields
    if (!data.bill_id || !data.vote) {
      toast.error('Please fill in all required fields')
      throw new Error('Missing required fields')
    }

    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('bill_votes')
      .insert([{
        bill_id: data.bill_id,
        user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use a default UUID for anonymous users
        vote: data.vote,
        comment: data.comment
      }])

    if (error) {
      toast.error('Failed to submit vote')
      throw error
    }

    toast.success('Vote submitted successfully!')
    return true
  } catch (error) {
    console.error('Error submitting bill vote:', error)
    throw error
  }
}

export async function getBills(type: 'national' | 'county', countyId?: string) {
  try {
    let query = supabase
      .from('bills')
      .select('id, title, description, type, county_id')
      .eq('type', type)

    if (type === 'county' && countyId) {
      query = query.eq('county_id', countyId)
    }

    const { data, error } = await query

    if (error) {
      toast.error('Failed to fetch bills')
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching bills:', error)
    throw error
  }
}

export async function getCounties() {
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('id, name, region')

    if (error) {
      toast.error('Failed to fetch counties')
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching counties:', error)
    throw error
  }
}

export async function getBillAnalytics(billId: string) {
  const { data, error } = await supabase
    .from('bill_votes')
    .select('vote')
    .eq('bill_id', billId)

  if (error) {
    throw error
  }

  const analytics = {
    total: data.length,
    yes: data.filter(vote => vote.vote === 'yes').length,
    no: data.filter(vote => vote.vote === 'no').length,
    undecided: data.filter(vote => vote.vote === 'undecided').length,
  }

  return analytics
}

export async function getBillSubmissions(billId: string) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('billId', billId)

    if (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }
}
