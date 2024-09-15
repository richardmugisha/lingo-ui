import React, { useState, useEffect } from 'react';
import './CardLearn.css';
import ProgressBar from "@ramonak/react-progress-bar";
import { ArrowBackIos as ArrowBack, ArrowForwardIos as ArrowFwd } from '@mui/icons-material';
import Spinner from 'react-spinner-material';
import { useSelector } from 'react-redux';

const CardLearn = () => {

  const { openDeck: deck } = useSelector(state => state.deck)
  console.log(deck)

  const [cardIndex, setCardIndex] = useState(0);
  const [cards, setCards] = useState(deck ? deck.words : []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft')
        setCardIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
      else if (event.key === 'ArrowRight')
        setCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cards.length]);

  useEffect(() => console.log(cards[cardIndex]), [cardIndex]);

  return (
    <>
      {deck ? (
        <div className="card-learn">
          <div className='card-learn--deckname'>{deck.deckName}</div>
          {cards.length ? (
            <>
              <div className="card-learn--body">
                <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev - 1 : cards.length - 1)}>
                  <ArrowBack />
                </i>
                <section className='card-learn--content'>
                  <div className='card-learn--word'>{cards[cardIndex].word}</div>
                  <ul className='card-learn--descr'>
                    <li>{cards[cardIndex].type}</li>
                    <li>{cards[cardIndex]['language style']}</li>
                  </ul>
                  <br />
                  <div><span>Def:  </span>{cards[cardIndex].meaning}</div>
                  <br />
                  <div><span>e.g: </span>{cards[cardIndex].example}</div>
                  <br />
                  <div>Synonym = {cards[cardIndex].synonym}</div>
                  <div>Antonym = {cards[cardIndex].antonym}</div>
                  <br />
                  <span>Related words : </span>
                  <ul className='card-learn--related'>
                    {cards[cardIndex]['related words'].map((wordHere, i) => <li key={i}>{wordHere}</li>)}
                  </ul>
                </section>
                <i className="arrow" onClick={() => setCardIndex((prev) => prev < cards.length - 1 ? prev + 1 : 0)}>
                  <ArrowFwd />
                </i>
              </div>
              <br />
              <div className='card-learn--info'>Swipe left or right</div>
              <br />
              <ProgressBar completed={Math.round((cardIndex + 1) * 100 / cards.length)} bgColor="black" />
            </>
          ) : (
            <div style={{height: '200px', textAlign: 'center'}}>-- empty deck --</div>
          )}
        </div>
      ) : (
        <div style={{ height: '200px', width: '200px', padding: '50px' }}>
          <Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} />
        </div>
      )}
    </>
  );
}

export default CardLearn;
