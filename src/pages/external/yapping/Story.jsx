
import { Button } from '@mui/material';
import useStory from './utils/useStory';
import { useState, useEffect } from 'react';
import Canvas from './Canvas';

const Story = (props) => {
  const {
    storySettings, setStorySettings,
    attempt, setAttempt,
    correctSentence, 
    handlePartSelection, callUponAi, 
    info, FinishButton
  } = useStory(props)


  const [selectedIndices, setSelectedIndices] = useState([])
  const [shiftKeySelected, setShiftKeySelected] = useState(false)

  const getSharedPrefix = (originalWord, comparisonWord) => {
    let matchLength = 0;
  
    for (
      let position = 0;
      position < originalWord.length && position < comparisonWord.length;
      position++
    ) {
      if (originalWord[position] !== comparisonWord[position]) break;
      matchLength++;
    }
  
    const sharedStart = originalWord.slice(0, matchLength);
    const remainingPart = originalWord.slice(matchLength);
  
    return {
      sharedStart,
      remainingPart,
    };
  };

  const handleSelectDetail = (index) => {
    console.log(index)
    if (shiftKeySelected) {
      // Range selection with shift
      if (storySettings.selectedIndices.length > 0) {
        const lastSelected = storySettings.selectedIndices[storySettings.selectedIndices.length - 1];
        const start = Math.min(lastSelected, index);
        const end = Math.max(lastSelected, index);
        const range = [];
        for (let i = start; i <= end; i++) {
          if (!storySettings.selectedIndices.includes(i)) {
            range.push(i);
          }
        }
        // setSelectedIndices(prev => [...prev, ...range]);
        setStorySettings(prev => prev.rebuild({selectedIndices: [...prev.selectedIndices, ...range]}))

      } else {
        setStorySettings(prev => prev.rebuild({selectedIndices: [index]}))

        // setSelectedIndices([index]);
      }
    } else {
        console.log(storySettings.selectedIndices)
        const newList = storySettings.selectedIndices.includes(index) ? [] : [index] 
        setStorySettings(prev => prev.rebuild({selectedIndices: newList}))
      // });
    }
  }

  const handleKeyDown = (e) => {
    if (storySettings.operation !== "edit") {
      callUponAi(e)
    }
  }
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        setShiftKeySelected(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") {
        setShiftKeySelected(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);


  const handleConditionToHide = (index) => {
    if (storySettings.operation == "edit") {
      return storySettings.selectedIndices.slice(1).includes(index)
    }
    else if ([0, 1].includes(index)) {
      return true
    }
    return false
  }

  return (
    <div className="story">
        {
          ['create', 'practice', 'read'].includes(storySettings.mode) &&
          <>
            <p className='sentence'>{
                storySettings.mode === 'creating-null' ? // making sure this doesn't happen because I plan to remove this on creating
                storySettings.sentenceInPractice.sentence && 
                storySettings.sentenceInPractice.sentence.split(' ')
                .map((word, index) => 
                    <label key={word + storySettings.sentenceInPractice.sentence[index - 1] + storySettings.sentenceInPractice.sentence[index + 1]}>
                      <span style={{background: storySettings.sentenceInPractice.blanked && !storySettings.sentenceInPractice.blanked.includes(word) && 'yellow'}}>{word}</span>
                      &nbsp;
                    </label>
                ) 
                : 
                attempt?.map(
                (word, index) => {
                  if (correctSentence[index] !== word) return (
                    <label key={word + index}>
                      <span style={{color: 'green', textDecoration: 'underline'}}>{getSharedPrefix(word, correctSentence[index])?.sharedStart}</span>
                      <span style={{color: 'red'}}>{getSharedPrefix(word, correctSentence[index])?.remainingPart}</span>
                    </label>
                  )
                  }
                )
              }
            </p>
            <article className="draft-story">
              {
                
              }
              
              {
                storySettings.state.mode === "create" &&
                <Canvas key={storySettings.scene?._id} defaultValue = {storySettings.scene?.text} typeSettings={storySettings.typeSettings} setStorySettings={setStorySettings} />
                
              }
            </article>
            {/* <FinishButton /> */}
          </>
        }
        
    </div>
  )
}

export default Story


const trash1 = () => {
  // storySettings.details?.map((currSentence, thisIndex) => (
                //   <span className={`draft-sentence ${["\n", "\t"].includes(currSentence.sentence) && !storySettings.operation && "whitespace"}`} key={thisIndex} 
                //         style={{opacity: thisIndex > storySettings.sentenceIndex ? .1: 1, background: storySettings.selectedIndices.includes(thisIndex) ? "grey": "", 
                //           display: handleConditionToHide(thisIndex) ? "flex" : "",
                //           ...(currSentence.typeSettings || storySettings.typeSettings),
                //         }}
                //         onClick={() => {{/*!storySettings.operation &&*/} handleSelectDetail(thisIndex)}}
                //   >
                //     { 
                //       storySettings.state.mode === "create" && storySettings.operation == "edit" && storySettings.selectedIndices[0] === thisIndex ?
                //       <input type='text' className='draft-sentence' value={storySettings.editableText} 
                //         onChange={e => setStorySettings(prev => prev.rebuild({editableText: e.target.value}))}
                //       />
                //       :
                //       (thisIndex == storySettings.sentenceIndex) ? 
                //         attempt.map((word, i) => {
                //           return word === correctSentence[i] ?
                //           <label key={word + i}>{word} </label>: 
                //           <span key={word + i}>
                //             <input type='text'  value={['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word.slice(0, word.length - 1) : word}
                //               className='attempt-input'
                //               onChange={ e => props.updateAttempt({word: e.target.value, fillIndex: i, fillingMode: "typing"}) }
                //             />&nbsp;
                //             {['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? <label>{word[word.length - 1]}</label> : ''}
                //           </span>
                //           }
                //       ) 
                //       :
                //       (
                //         thisIndex < storySettings.sentenceIndex ? currSentence.sentence : currSentence.blanked
                //       )
                //     }
                //   </span>
                // ))
}

const trash2 = () => {
  // selectedWords.length > 0 &&
                // <input type="text" className="draft-sentence"
                //   placeholder={storySettings.details.length ? "": "Type your story here using the provided words"} name="" id="" autoFocus
                //   value={storySettings.state.mode === 'create' ? storySettings.state.sentenceInProgress?.sentence: attempt.join(' ') }
                //   onChange={(e) => {
                //     if (storySettings.state.mode === 'create') setStorySettings((prev) => prev.rebuild({ sentenceInProgress: { sentence: e.target.value } }))
                //     else if (storySettings.state.mode === 'practice') setAttempt(e.target.value.split(' '))
                //     }
                //   }
                //   onKeyDown={handleKeyDown}
                //   // onMouseUp={() => handlePartSelection()}
                //   readOnly={info.exists && info.type === 'warning'}
                // />
}