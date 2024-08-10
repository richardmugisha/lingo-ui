
import { useDispatch } from 'react-redux';
import { setQuizLength, setFormat } from '../../../features/personal/quiz/quizSlice';

const QuizShortGuess = () => {
    
    const dispatch = useDispatch()

    const format = {
        topProgressbar: true,
        firstWordUnderTopProgressbar: 'guess the word for:',
        content: {
          type: 'guess',
          body: ["Lorem ipsum dolor sit amet consectetur adipisicing elit."]
        },
        bottomProgressbar: true,
    }
    
    dispatch(setFormat(format));
    dispatch(setQuizLength('short'));
   
}
export default QuizShortGuess
