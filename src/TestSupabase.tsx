import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';

interface TestRow {
  id: number;
  message: string;
}

const TestSupabase = () => {
  const [data, setData] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase.from('test_table').select('*');
    if (error) {
      console.log('Error fetching data:', error.message);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  fetchData();
}, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Supabase Test Data</h2>
      <ul>
        {data.map((row) => (
          <li key={row.id}>{row.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestSupabase;
