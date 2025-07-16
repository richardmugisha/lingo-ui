import './App.css';
import Home from './pages/home/Home';
import Personal from './pages/personal/Personal';
import Network from './pages/network/Network';
import Header from './pages/header/Header';
import More from './pages/external/More';
import RabbitHole from './pages/rabbit-hole/RabbitHole';
import Toast from './components/toast/Toast';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import AxiosWrapper from './api/http/AxiosWrapper';
import { ping } from './api/http';
import { httpEndpoint } from '../serverConfig'
const token = localStorage.getItem('token');
const user = localStorage.getItem('user')
import { useState, useEffect } from 'react';


function App() {
  const [userAuthed, setUserAuthed] = useState((token && user) ? true : false); 
  useEffect(() => {
    if (token) {
      AxiosWrapper.get(`${ httpEndpoint }/protected-route`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const { user } = res.data
        // console.log(user)
        if (user) localStorage.setItem('user')
        }
      )
      .catch((error) => {
        if (error.message !== 'Network Error' && !error.message?.includes('Throttled')) setUserAuthed(false);
        if (error.message === 'Invalid or expired token') localStorage.removeItem('user')
      });

    }
    

  }, [token]);

  useEffect(() => {
    let intId = setInterval(() => {
      ping()
    }, 60*1000);

    return () => clearInterval(intId)
  }, [])

  return (
    <div className="App">
      <Toast />
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
        <RabbitHole />
        <Routes>
          <Route path='personal/*' element={<Personal />} />
          <Route path='more/*' element={<More />} />
          <Route path='network/*' element={<Network />} />
        </Routes>
      </main>
      {/* <footer>
      </footer> */}
    </>
  );
}
