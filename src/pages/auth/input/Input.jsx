

import React, { useState } from 'react';
import './Input.css';

import { MdEmail } from "react-icons/md";
import { IoKeySharp, IoEye, IoEyeOff } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Input = ({type, placeholder, value, setValue, top}) => {
  const [show, setShow] = useState(false)
  return (
    <>
        {placeholder === 'username' && <FaUser className='Input--icon' id='Input-username-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'email' && <MdEmail className='Input--icon' id='Input-email-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'password' &&  <IoKeySharp className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, left: '50px'}}/> }
        {type === 'password' && 
          (show ?
            <IoEye onClick={() => setShow(!show)} className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, right: '80px'}}/> :
            <IoEyeOff onClick={() => setShow(!show)} className='Input--icon' id='Input-password-icon' style={{position: 'absolute', top: `${top}px`, right: '80px'}}/> 
          )
        }
        <label htmlFor={placeholder}></label>
        <input id={`Input-${placeholder}`} name={placeholder} className='Input' type={type !== 'password' ? type : show ? 'text': 'password'} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)}/>
    </>
    )
}

export default Input
