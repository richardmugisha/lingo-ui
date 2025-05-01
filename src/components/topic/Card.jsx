
import "./Card.css"
import { wholeTopicPerc } from "../../pages/personal/modals/guided-learning/utils/mastery"

const Card = ({ topic, userId, onClick, onDoubleClick }) => {
  return <li className="topic-card" onClick={onClick} onDoubleClick={onDoubleClick}>
    
    <div className="topic--meta topic--language-and-owner">
        <div>{topic.language?.slice(0, 2)}</div>
        {topic.creator === userId && <div>Yours</div>}
    </div>

    {topic.name?.replaceAll("_", " ", 1)}

    <div className="topic--meta topic--mastery-and-length">
        <div>Mastery: 
            {
            (() => {
                return Math.round(wholeTopicPerc(topic.learning))
                })()
            }
            %</div>
        <div>{topic.words?.length} words</div>
    </div>

  </li>
}

export default Card