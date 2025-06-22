import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SpacePage from './pages/SpacePage';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!session ? <AuthPage /> : <Navigate to="/spaces" />} 
        />
        <Route 
          path="/spaces" 
          element={
            session ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/spaces/:spaceId" 
          element={
            session ? (
              <Layout>
                <SpacePage />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
