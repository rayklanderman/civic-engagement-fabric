import { supabase } from '@/lib/supabase'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('*')
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('Successfully connected to Supabase')
    console.log('Counties found:', data.length)
    return true
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}

export async function testContactSubmission() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message'
        }
      ])
      .select()
    
    if (error) {
      console.error('Contact submission test failed:', error)
      return false
    }
    
    console.log('Successfully submitted contact form')
    return true
  } catch (error) {
    console.error('Contact submission test failed:', error)
    return false
  }
}

export async function testBillOperations() {
  try {
    // Test fetching national bills
    const { data: nationalBills, error: nationalError } = await supabase
      .from('bills')
      .select('*')
      .eq('type', 'national')
    
    if (nationalError) {
      console.error('Failed to fetch national bills:', nationalError)
      return false
    }
    
    console.log('Successfully fetched national bills:', nationalBills.length)
    
    // Test fetching county bills
    const { data: countyBills, error: countyError } = await supabase
      .from('bills')
      .select('*')
      .eq('type', 'county')
      .eq('county_id', 'nairobi')
    
    if (countyError) {
      console.error('Failed to fetch county bills:', countyError)
      return false
    }
    
    console.log('Successfully fetched Nairobi county bills:', countyBills.length)
    
    // Test bill voting
    if (nationalBills.length > 0) {
      const { error: voteError } = await supabase
        .from('bill_votes')
        .insert([
          {
            bill_id: nationalBills[0].id,
            user_id: '12345678-1234-1234-1234-123456789012',
            vote: 'yes',
            comment: 'Test vote'
          }
        ])
      
      if (voteError) {
        console.error('Failed to submit vote:', voteError)
        return false
      }
      
      console.log('Successfully submitted test vote')
    }
    
    return true
  } catch (error) {
    console.error('Bill operations test failed:', error)
    return false
  }
}
