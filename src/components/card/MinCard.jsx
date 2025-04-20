
import React from 'react'
import "./MinCard.css"

const MinCard = ({wObj}) => {
  return (
    <>
        <div className='card-head'>
            <span>{wObj.word}</span>
            <span>{wObj.type}</span>
        </div>
        <div className='card-body'>
            <p>def: {wObj.meaning}</p>
            <p>e.g: {wObj.example}</p>
        </div>
    </>
  )
}

export default MinCard