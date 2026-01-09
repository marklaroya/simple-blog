import React, { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './utils/supabaseClient';
import TestSupabase from './TestSupabase';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setConnectionStatus('❌ Connection failed: ' + error.message);
      } else {
        setConnectionStatus('✅ Supabase connected successfully!');
      }
    } catch (err) {
      setConnectionStatus('❌ Error: ' + (err as Error).message);
    }
  };

  return (
    <div className="App">
      <h1>Simple Blog</h1>
      <h2>Supabase Connection Test</h2>
      <p>{connectionStatus}</p>
      
      <hr />
      
      <TestSupabase />
    </div>
  );
}

export default App;