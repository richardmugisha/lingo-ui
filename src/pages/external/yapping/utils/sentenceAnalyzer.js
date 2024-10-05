
export const getKeywords = (fullSentenceSplit, blankedSentenceSplit) => {
    `
    This function takes arrays of words in a sentence and compares them with the ones in the sentence with blanks
    And uses that to retrieve the keywords
    `
    if (!(fullSentenceSplit.length && blankedSentenceSplit)) return ''

    let sentIndex = 0
    let blankIndex = 0
    const missing = []
    while (blankIndex < blankedSentenceSplit.length) {
        const currWord = fullSentenceSplit[sentIndex]
        const currBlank = blankedSentenceSplit[blankIndex]
        if (currWord !== currBlank) {
            let cont = currWord
            while ( !(blankedSentenceSplit[blankIndex + 1] === fullSentenceSplit[sentIndex + 1] || ['_', '-', '['].includes(blankedSentenceSplit[blankIndex + 1][0]) )) {
                sentIndex++;
                cont += ' ' + fullSentenceSplit[sentIndex]
            }
        missing.push(cont)
        }
        sentIndex++;
        blankIndex++;
    }

    return missing.map(word => {
        let done = false
        return word.split('').reverse().map(char => {
                if ([' ', ',', "'", '"', ':', ';'].includes(char) && !done ){
                    return ''
                }
                else {
                    done = true
                    return char
                }
            }
        ).reverse().join('')
    })
  }

export const removeKeywords = (fullSentenceSplit, blankedSentenceSplit) => {
    `
    This function takes arrays of words in a sentence and compares them with the ones in the sentence with blanks
    And uses that to remove the keywords from the sentence
    `
    if (!(fullSentenceSplit.length && blankedSentenceSplit)) return ''

    let sentIndex = 0
    let blankIndex = 0
    const sent = []
    while (blankIndex < blankedSentenceSplit.length) {
        const currWord = fullSentenceSplit[sentIndex]
        const currBlank = blankedSentenceSplit[blankIndex]
        if (currWord !== currBlank) {
            let cont = currWord
            while ( !(blankedSentenceSplit[blankIndex + 1] === fullSentenceSplit[sentIndex + 1] || ['_', '-', '['].includes(blankedSentenceSplit[blankIndex + 1][0]) )) {
                sentIndex++;
                cont += ' ' + fullSentenceSplit[sentIndex]
            }
            
            const dashed = cont.split('').map(char => [' ', ',', "'", '"', ':', ';'].includes(char) ? char : '_').join('')
            sent.push(dashed)
        }

        else sent.push(currBlank)

        sentIndex++;
        blankIndex++;
    }
    console.log(sent.join(' '))
    return sent.join(' ')
}
