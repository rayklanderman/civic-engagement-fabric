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
  try {
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
  } catch (error) {
    console.error('Error fetching bills:', error)
    throw error
  }
}

interface BillParticipation {
  bill_id: string
  name: string
  email: string
  phone_number: string
  id_number: string
  comment: string
}

// First check if the table exists
async function checkTable() {
  try {
    const { data, error } = await supabase
      .from('citizen_participation')  // Try this table name
      .select('*')
      .limit(1)

    if (error) {
      console.error('Table check error:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Table check failed:', error)
    return false
  }
}

export async function submitBillParticipation(participationData: {
  billId: string
  name: string
  email: string
  phoneNumber: string
  idNumber: string
  comment: string
}) {
  try {
    const tableExists = await checkTable()
    if (!tableExists) {
      throw new Error('Database table not found. Please check your database setup.')
    }

    const formattedData: BillParticipation = {
      bill_id: participationData.billId,
      name: participationData.name,
      email: participationData.email,
      phone_number: participationData.phoneNumber,
      id_number: participationData.idNumber,
      comment: participationData.comment
    }

    const { data, error } = await supabase
      .from('citizen_participation')  // Try this table name
      .insert([formattedData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error submitting participation:', error)
    throw error
  }
}
