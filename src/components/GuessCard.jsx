import React, { useState, useEffect, useRef } from 'react';
import './GuessCard.css';
import ProgressBar from "@ramonak/react-progress-bar";
import { FaQuestion } from 'react-icons/fa';
import { FcCheckmark } from "react-icons/fc";

const GuessCard = ({ cardFormat, btmProSize, handleItemClick, topProSize, quizType, quizLength }) => {
    const [checkCorrect, setCheckCorrect] = useState(false);
    const [color, setColor] = useState('white');
    const [boxShadowSpread, setBoxShadowSpread] = useState(0);
    const [cardAnim, setCardAnim] = useState(false);
    const [animDir, setAnimDir] = useState('right-to-left')
    // const [animDir, setAnimDir] = useState('left-to-right')

    const guessBoxRef = useRef(null);
    const guessCardRef = useRef(null);
    const guessContainerRef = useRef(null);
    const allowScrollRef = useRef(false);

    const handleSwipe = (correct) => {
        console.log(allowScrollRef.current);
        if (allowScrollRef.current) {
            allowScrollRef.current = false;
            setCheckCorrect(false)
            setAnimDir(correct ? 'left-to-right' : 'right-to-left')
            return handleItemClick('no item', correct);
        }
    };

    useEffect(() => {
        allowScrollRef.current = checkCorrect;
        if (!checkCorrect) return
        const guessBox = guessBoxRef.current;
        const guessContainer = guessContainerRef.current
        setCardAnim(false);
        if (guessBox) {
            guessContainer.style.width = '600px'
            guessBox.scrollLeft = (guessBox.scrollWidth - guessBox.clientWidth) / 2;
            guessBox.scrollTop = (guessBox.scrollHeight - guessBox.clientHeight) / 2;
        }
    }, [checkCorrect]);

    useEffect(() => {
        const guessBox = guessBoxRef.current;
        const guessContainer = guessContainerRef.current;
        if (guessBox) {
            guessBox.scrollLeft = (guessBox.scrollWidth - guessBox.clientWidth) / 2;
            guessBox.scrollTop = (guessBox.scrollHeight - guessBox.clientHeight) / 2;
            guessContainer.style.width = '300px'
            setCardAnim(true);
        }
    }, [cardFormat]);

    useEffect(() => {
        const guessBox = guessBoxRef.current;

        const handleScroll = () => {
            const boxRect = guessBox.getBoundingClientRect();
            const scrollWidth = guessBox.scrollWidth - boxRect.width;
            const currentPosition = guessBox.scrollLeft;
            const percentageScrolled = 200 - (currentPosition / scrollWidth) * 200;
            setBoxShadowSpread(0.5 * Math.abs(100 - percentageScrolled));

            const x = percentageScrolled;
            const LEFT = 0;
            const RIGHT = 200;
            const midpoint = (RIGHT + LEFT) / 2;

            if (!(LEFT + 5 < x && x < RIGHT)) handleSwipe(x > 100);

            const values = waveToColor(x, LEFT, midpoint);

            const redX = LEFT < x && x < midpoint ? values[0] : values[1];
            const greenX = LEFT < x && x < midpoint ? values[1] : values[0];
            const blueX = Math.min(redX, greenX);

            const [red, green, blue] = [redX, greenX, blueX].map(i => Math.round(255 * i));
            setColor(`rgb(${red}, ${green}, ${blue})`);
        };

        if (guessBox) guessBox.addEventListener('scroll', handleScroll);

        return () => {
            if (guessBox) guessBox.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='guess-quiz'>
            <ProgressBar completed={Math.floor(topProSize)} bgColor="black" />
            <div className='guess-top'>
                {/* <FaUndo className='dir' /> */}
                {labels[quizLength][quizType]}
                {/* <FaRedo className='dir' /> */}
            </div>
            <div className='guess-box' ref={guessBoxRef} >
                <div className='guess-container' ref={guessContainerRef}>
                    <div
                        ref={guessCardRef}
                        onClick={() => setCheckCorrect(true)}
                        className={`guess-card ${cardAnim && `card-${animDir}`} ${checkCorrect && 'answer-card'}`}
                        style={{ boxShadow: `0 0 ${checkCorrect ? boxShadowSpread : '0'}px ${checkCorrect ? color : 'white'}` }}
                    >
                        <div>{checkCorrect ? <FcCheckmark /> : <FaQuestion />}</div>
                        <p>{checkCorrect ? cardFormat.answer : cardFormat.question}</p>
                        <p className='guess-card--footer'>{checkCorrect ? 'Swipe Right if you were right, and Left if you were off' : 'Tap to check the answer when ready'}</p>
                    </div>
                </div>
            </div>
            <ProgressBar completed={Math.floor(btmProSize)} bgColor="black" />
        </div>
    );
};

export default GuessCard;

const labels = {
    'long': {
        'meaning': 'What is the meaning of ',
        'synonym': 'Give a synonym of ',
        'antonym': 'Give an antonym of ',
        'example': 'Make a sentence with '
    },
    'short': {
        'meaning': 'What is the word/expression for ',
        'synonym': 'Give a synonym of ',
        'antonym': 'Give an antonym of ',
        'example': 'Find a word/expression to fill in the blanks '
    }
};

const waveToColor = (x, low, midpoint) => {
    const angle = (x - low) * 2 * Math.PI / midpoint;
    return [higherFreqCos(angle), lowerFreqCos(angle)];
};

const higherFreqCos = (x) => {
    return 1;
    //return (Math.cos(x) + 3)/4
};

const lowerFreqCos = (x) => {
    return (-2 * Math.cos(0.5 * x) + 2) / 4;
};
