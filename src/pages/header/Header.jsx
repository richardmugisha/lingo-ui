

import React from 'react';
import './Header.css';

import {useNavigate} from 'react-router-dom'

import Logo from '../home/Logo'

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  return (
    <header>
        <div className='header-logo' style={{cursor: 'pointer'}} onClick={() => navigate('/portal/personal')}><Logo /></div>
        <nav>
            <ul className="nav-right">
              <li className="a">Quiz</li>
              <li className="a">Add</li>
              <li className="a" onClick={() => navigate('/portal/more')}>More</li>
            </ul>
            <div className="profile">
            <span>{user.username}</span>
            <span></span>
        </div>
        </nav>
        
    </header>
  )
}

export default Header
