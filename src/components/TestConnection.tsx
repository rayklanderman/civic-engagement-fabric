import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { testSupabaseConnection, testContactSubmission, testBillOperations } from '@/utils/test-utils'

export function TestConnection() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const runTests = async () => {
    setTesting(true)
    setResults([])

    // Test database connection
    const connectionResult = await testSupabaseConnection()
    setResults(prev => [...prev, 
      `Database connection: ${connectionResult ? '✅ Success' : '❌ Failed'}`
    ])

    // Test contact form
    const contactResult = await testContactSubmission()
    setResults(prev => [...prev, 
      `Contact submission: ${contactResult ? '✅ Success' : '❌ Failed'}`
    ])

    // Test bill operations
    const billResult = await testBillOperations()
    setResults(prev => [...prev, 
      `Bill operations: ${billResult ? '✅ Success' : '❌ Failed'}`
    ])

    setTesting(false)
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
      <Button 
        onClick={runTests}
        disabled={testing}
        variant={testing ? "outline" : "default"}
      >
        {testing ? 'Running Tests...' : 'Test Database Connection'}
      </Button>
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div key={index} className="text-sm">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
