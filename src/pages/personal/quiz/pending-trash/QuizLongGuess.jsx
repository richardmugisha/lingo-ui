
import { useDispatch } from 'react-redux';
import { setQuizLength, setFormat } from '../../../../features/personal/quiz/quizSlice';

const QuizLongGuess = () => {
    
    const dispatch = useDispatch()

    const format = {
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

    dispatch(setFormat(format));
    dispatch(setQuizLength('long'));
    
}

export default QuizLongGuess
