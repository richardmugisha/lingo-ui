
import React from 'react'
import "./Card.css"

const WordCard = ({wObj}) => {
  return (
    <li className='word-card' key={wObj._id}>
        <div className='card-head'>
            <span>{wObj.word}</span>
            <span>
              <div>{wObj.type}</div>
              <span>- {wObj["language style"]}</span>
            </span>
        </div>
        <div className='card-body'>
            <p>def: {wObj.meaning}</p>
            <p>e.g: {wObj.example}</p>
        </div>
       
        <div className='card-footer'>
          <p>synonym: {wObj.synonym}</p>
          <p>antonym: {wObj.antonym}</p>
        </div>
    </li>
  )
}

export default WordCard