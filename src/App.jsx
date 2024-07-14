import './App.css';
import Home from './pages/home/Home';
import Personal from './pages/personal/personal/Personal';
import Network from './pages/network/Network';
import Header from './pages/header/Header';

import More from './pages/external/More';

import ProtectedRoute from './ProtectedRoute';

import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/*' element={<Home />} />
          <Route path="/portal/*" element={<ProtectedRoute element={Portal} />} />
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
        <Route path='personal' element={<Personal />} />
        <Route path='more/*' element={<More />} />
        <Route path='network' element={<Network />} />
      </Routes>
    </main>

    <footer>
    </footer>
  </>
  )
}
