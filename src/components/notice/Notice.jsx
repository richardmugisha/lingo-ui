
import React from 'react'
import "./Notice.css"
import { Link } from 'react-router-dom'


const Notice = ({ page, noTopics, noSubTopics, noWords, noLearning, noMyLearning}) => {
    // console.log( page, noTopics, noSubTopics, noWords, noLearning)
  return (
    <div className='notice'>
        <h2>
            {
                (page === "topics" && noTopics) ? "You don't have any topics!":
                (page === "topics" && noSubTopics) ? "This topic doesn't have any subtopics!":
                (page === "words" && noWords) ? "This topic doesn't have any words":
                (page === "my-learning" && noMyLearning) ? "You don't have any learning plan in progress":
                (page === "stories" && noLearning) ? "You need to learn the words on this topic before you go to story time":
                (page === "chats" && noLearning) ? "You need to learn the words on this topic before you start role playing":
                "Something went wrong"
            }
        </h2>
        <p>
            {
                (page === "topics" && noTopics) ? "Create a new topic to start":
                (page === "topics" && noSubTopics) ? "Create a new subtopic, or switch to words":
                (page === "words" && noWords) ? "Populate it with words":
                (page === "my-learning" && noMyLearning) ? "Browse the topics and start learning":
                (page === "stories" && noLearning) ? "Click to be redirected to the learning space!":
                (page === "chats" && noLearning) ? "Click to be redirected to the learning space!":
                "Click to go to the home page"
            }
        </p>
        {
            ((["stories", "chats"].includes(page) && noLearning)) ?
            <Link to="../learning" className="custom-button-1">Learning</Link> :
            (noTopics || noSubTopics || noWords) && <Link to="/" className="custom-button-1">Home page</Link>
        }
        
    </div>
  )
}

export default Notice