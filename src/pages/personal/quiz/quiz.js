
const quiz = (route) => {

    const formatQLM = {
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'what is meaning/usage of:',
        //secondWordUnderTopProgressbar: 'algorithm',
        type: 'noun',
        content: {
          type: 'mcq',
          correctAnswer: "Mugisha is the lion king. he is a beast",
          body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit.", "Lorem ipsum dolor sit amet consectetur adipisicing elit.","Mugisha is the lion king. he is a beast", "Lorem ipsum dolor sit amet consectetur adipisicing elit."]
        },
        bottomProgressbar: true,
    }

    const formatQSM = {
      label0: false, // the text above the top progressbar,
      label1: false, // the first text below the progressbar,
      label2: false, // the second text below the progressbar,
      label3: false, // the word above the bottom progressbar if there is
      label4: false, // the word under teh btm progressbar,
      topProgressbar: true,
      btmProgressbar: true,
      content: {
        type: 'mcq',
        },
    }

    const formatQLG = {
      aboveTopProgressbar: "Guess ...",
      topProgressbar: true,
      firstWordUnderTopProgressbar: 'guess the meaning of:',
      word: 'algorithm is the way',
      type: 'idiom',
      content: {
        type: 'guess',
        body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit."]
      },
      bottomProgressbar: true,
    }

    const formatQSG = {
      topProgressbar: true,
      firstWordUnderTopProgressbar: 'guess the word for:',
      content: {
        type: 'guess',
        body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit."]
      },
      bottomProgressbar: true,
    }

    const format = route === 'quiz-long-guess' ? formatQLG :
                      route === 'quiz-long-mcq' ? formatQLM:
                         route === 'quiz-short-guess' ? formatQSG:
                            formatQSM

    return format
    
}

export default quiz
