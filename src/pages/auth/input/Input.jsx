

import React from 'react';
import './Input.css';

import { MdEmail } from "react-icons/md";
import { IoKeySharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Input = ({type, placeholder, value, setValue, top}) => {
  return (
    <>
        {placeholder === 'username' && <FaUser className='Input--icon' id='Input-username-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'email' && <MdEmail className='Input--icon' id='Input-email-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'password' && <IoKeySharp className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        <label htmlFor={placeholder}></label>
        <input id={`Input-${placeholder}`} name={placeholder} className='Input' type={type} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)}/>
    </>
    )
}

export default Input
