 /* <div className="common-main"> 
            <div className="top">
              {!['guess', 'mcq'].includes(format.content.type) && card.word && <div>{card.word}</div>}
              {!['guess', 'mcq'].includes(format.content.type) && card.type && <div>{card.type}</div>}
            </div>

            <div className="middle">
              { format.content.type === 'guess' && <i className="arrow"><FiChevronLeft /></i>}
            { format.content && <div className="content">{incorrectArray.map(index => { // incorrect is the array of 4 random cards in the deck
              if (quizLength === 'short') return deck[index].word;
              if (['synonym', 'antonym'].includes(quizType)) return deck[index][quizType][index%4] // synonym / antonym at this almost random location
              return deck[index]['meaning'][index%4][quizType].toLowerCase().replace(deck[index].word, '____')
            }).map((item, indexHere) => {
              return  <div style={{backgroundColor: selectedItem && correctPos === indexHere ? 'green': (selectedItem === item) ? 'red': ''}} 
                          onClick={() => {handleItemClick(item, indexHere)}}>{item}
                      </div>
            })}</div>}
              { format.content.type === 'guess' && <i className="arrow"><FiChevronRight /></i>}
            </div>
          </div> */

    // useEffect(() => {
    //   if (format.content.type === 'mcq') {
    //     if (quizLength === 'short') {
    //       format.aboveTopProgressbar = quizType === 'synonym' || quizType === 'antonym'? card[quizType][randomGen(card[quizType].length-1, 1, '')]: card['meaning'][randomGen(card['meaning'].length-1, 1, '')][quizType];
    //       format.firstWordUnderTopProgressbar = quizType === 'example'? 'fill in the blanks': `is the ${quizType} of:`;
    //     }
    //     else if (quizLength === 'long') {
    //       format.firstWordUnderTopProgressbar = card.word
    //       format.aboveTopProgressbar = quizType === 'example'? 'Fill in the blanks with this': `What is the ${quizType} of:`;
          
    //     }
    //   }
    // }, [])
    
//     const refwidthParent = useRef(null)
//     const refWidth = useRef(null);

//     const refwidthLower = useRef(null);

//     useEffect (() => {
//       const interval = setInterval(() => {
//         if (!refWidth.current || !refwidthParent.current) return
//           size +=delay/10/time;
//           if (size > 100) setQuizDone(true)
//           refWidth.current.style.width = `${size}%`
//           setUpSize(Math.floor(size))
//         }, 
//         delay);
      
//       return () => clearInterval(interval)
//     }, [])
    
//     useEffect(() => {
//       setIncorrectArray(shuffledNumbers(randomGen(deck.length-2, 3, deck.indexOf(card)).concat(deck.indexOf(card))));
//       setTitle(format.aboveTopProgressbar.toLowerCase().replace(card.word, '___'))
//     }, [card])

//     useEffect(()=> {
//       setCorrectPos(incorrectArray.indexOf(deck.indexOf(card)))
//     }, [incorrectArray])


//     const handleItemClick = (item, itemIndex) => {
//       if (correctPos === itemIndex) correctAnswers += 1;
//       setSelectedItem(item);
//       length += 100/deck.length;
//       setLowSize(Math.floor(length))
//       if (length >= 100) setQuizDone(true)
//       refwidthLower.current.style.width = `${length}%`
//       setTimeout(() => {
//         cardIndex += cardIndex < order.length - 1 ? 1 : 0 ; 
//         setSelectedItem('')
//         setCard(deck[order[cardIndex]]);
//         setSelectedItem(null)
//       }, 1000)
//     };


//   return (
//     <>
//   {quizDone ? <Performance givenTime={time} duration={size*time/100} correctAnswers={correctAnswers} all={deck.length} /> : 
//     <div className='common-card'>
//       <div className="common-head">
//         <div>{title}</div>
//           {format.topProgressbar && <div ref={refwidthParent} className='sticks'> 
//           <div ref={refWidth}>{`${upsize}%`}</div>
//         </div>}
//         {format.firstWordUnderTopProgressbar && <div>{format.firstWordUnderTopProgressbar}</div>}
//         {format.secondWordUnderTopProgressbar && <div>{ format.secondWordUnderTopProgressbar }</div>}
//       </div>
//       <div className="common-main"> 
//         <div className="top">
//           {!['guess', 'mcq'].includes(format.content.type) && card.word && <div>{card.word}</div>}
//           {!['guess', 'mcq'].includes(format.content.type) && card.type && <div>{card.type}</div>}
//         </div>
//         <div className="middle">
//           { format.content.type === 'guess' && <i className="arrow"><FiChevronLeft /></i>}
//         { format.content && <div className="content">{incorrectArray.map(index => { // incorrect is the array of 4 random cards in the deck
//           if (quizLength === 'short') return deck[index].word;
//           if (['synonym', 'antonym'].includes(quizType)) return deck[index][quizType][index%4] // synonym / antonym at this almost random location
//           return deck[index]['meaning'][index%4][quizType].toLowerCase().replace(deck[index].word, '____')
//         }).map((item, indexHere) => {
//           return  <div style={{backgroundColor: selectedItem && correctPos === indexHere ? 'green': (selectedItem === item) ? 'red': ''}} 
//                       onClick={() => {handleItemClick(item, indexHere)}}>{item}
//                   </div>
//         })}</div>}
//           { format.content.type === 'guess' && <i className="arrow"><FiChevronRight /></i>}
//         </div>
//       </div>
//       <div className="common-foot">
//         <div>{format.wordAboveBottomProgressbar}</div>
//         {format.bottomProgressbar && <div className='sticks'>
//           <div ref={refwidthLower}>{`${LowSize}%`}</div>
//         </div>}
//       </div>
//     </div>
//     }
//   </>

//   )
// }
