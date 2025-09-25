import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase-client' // Adjust path as needed

function MyComponent() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const { data: fetchedData, error } = await supabase
          .from('Cours') // Replace 'your_table_name' with your actual table name
          .select('*') // Select all columns, or specify columns like 'id, name'

        if (error) {
          throw error
        }
        setData(fetchedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures this runs only once on mount

  if (loading) return <p>Loading data...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Data from Supabase:</h1>
      <ul>
        {data.map((item) => (
          <li key={item.codeCours}>{item.nomCours}</li> 
        ))}
      </ul>
    </div>
  )
}

export default MyComponent