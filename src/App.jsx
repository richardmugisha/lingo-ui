import './App.css';
import Home from './pages/home/Home';
import Personal from './pages/personal/personal/Personal';
import Network from './pages/network/Network';
import Header from './pages/header/Header';
import More from './pages/external/More';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');
import { useState, useEffect } from 'react';


function App() {
  const [userAuthed, setUserAuthed] = useState(token ? true : false); 

  useEffect(() => {
    if (token) {
      axios.get(`${baseUrl}/api/v1/protected-route`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .catch(() => {
        setUserAuthed(false);
        localStorage.removeItem('user')
      });

    }
    

  }, [token]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/*' element={<Home userAuthed={userAuthed} setUserAuthed={setUserAuthed}/>} />
          <Route path="/portal/*" element={<ProtectedRoute element={Portal} userAuthed={userAuthed} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

const Portal = () => {

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='personal/*' element={<Personal />} />
          <Route path='more/*' element={<More />} />
          <Route path='network/*' element={<Network />} />
        </Routes>
      </main>
      <footer>
      </footer>
    </>
  );
}
