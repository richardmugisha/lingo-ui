export default (lev) => {
    const level = lev % 6
    if (level === 0 ) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'meaning'
    }
    if (level === 1) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'example'
    }
    if (level === 2) return {
      quizLength: 'long',
      route: 'quiz-long-mcq',
      quizType: 'meaning'
    }
    if (level === 3) return {
      quizLength: 'long',
      route: 'quiz-long-mcq',
      quizType: 'example'
    }
    if (level === 4) return {
      quizLength: 'short',
      route: 'quiz-long-mcq',
      quizType: 'synonym'
    }
    if (level === 5) return {
      quizLength: 'short',
      route: 'quiz-short-mcq',
      quizType: 'meaning'
    }
  }

