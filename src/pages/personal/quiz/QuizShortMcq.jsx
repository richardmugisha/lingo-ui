
import { useDispatch } from 'react-redux';
import { setQuizLength, setFormat } from '../../../features/personal/quiz/quizSlice';

const QuizShortMcq = () => {

    const dispatch = useDispatch()

    const format = {
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
  
    dispatch(setFormat(format));
    dispatch(setQuizLength('short'));

}

export default QuizShortMcq
