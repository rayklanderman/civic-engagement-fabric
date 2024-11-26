import { supabase } from '@/lib/supabase'

interface BillVote {
  bill_id: string
  user_id: string
  vote: 'yes' | 'no' | 'undecided'
  comment?: string
}

export async function submitBillVote(voteData: BillVote) {
  const { data, error } = await supabase
    .from('bill_votes')
    .insert([
      {
        ...voteData,
        created_at: new Date().toISOString(),
      },
    ])

  if (error) {
    throw error
  }

  return data
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

export async function getBills(type: 'national' | 'county', countyId?: string) {
  let query = supabase
    .from('bills')
    .select('*')
    .eq('type', type)

  if (type === 'county' && countyId) {
    query = query.eq('county_id', countyId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}
