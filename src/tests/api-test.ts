import { supabase } from '@/lib/supabase'
import { submitContactForm } from '@/api/contact'
import { getBills, submitBillVote, getBillAnalytics } from '@/api/bills'

async function testContactForm() {
  console.log('Testing contact form submission...')
  try {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    }
    const result = await submitContactForm(formData)
    console.log('Contact form submission successful:', result)
  } catch (error) {
    console.error('Contact form submission failed:', error)
  }
}

async function testBillsAPI() {
  console.log('\nTesting bills API...')
  
  // Test getting national bills
  try {
    console.log('\nFetching national bills...')
    const nationalBills = await getBills('national')
    console.log('National bills:', nationalBills)
  } catch (error) {
    console.error('Failed to fetch national bills:', error)
  }

  // Test getting county bills
  try {
    console.log('\nFetching Nairobi county bills...')
    const countyBills = await getBills('county', 'nairobi')
    console.log('Nairobi county bills:', countyBills)
  } catch (error) {
    console.error('Failed to fetch county bills:', error)
  }

  // Test submitting a bill vote
  try {
    console.log('\nSubmitting a test vote...')
    const voteData = {
      bill_id: '', // We'll get this from the first bill we find
      user_id: '12345678-1234-1234-1234-123456789012', // Test user ID
      vote: 'yes' as const,
      comment: 'Test vote comment'
    }

    // Get the first bill to vote on
    const bills = await getBills('national')
    if (bills && bills.length > 0) {
      voteData.bill_id = bills[0].id
      const voteResult = await submitBillVote(voteData)
      console.log('Vote submission successful:', voteResult)

      // Test getting analytics for this bill
      console.log('\nFetching analytics for the voted bill...')
      const analytics = await getBillAnalytics(bills[0].id)
      console.log('Bill analytics:', analytics)
    }
  } catch (error) {
    console.error('Failed to submit vote or get analytics:', error)
  }
}

async function testDatabaseConnection() {
  console.log('\nTesting database connection...')
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('*')
    
    if (error) throw error
    console.log('Successfully connected to database. Counties found:', data.length)
  } catch (error) {
    console.error('Database connection test failed:', error)
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting API tests...\n')
  
  await testDatabaseConnection()
  await testContactForm()
  await testBillsAPI()
  
  console.log('\nAPI tests completed.')
}

// Run the tests
runAllTests()
