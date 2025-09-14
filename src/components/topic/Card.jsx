
import "./Card.css"
import { wholeTopicPerc } from "../../pages/personal/modals/guided-learning/utils/mastery"
import { Delete, Edit, Share, CheckBox, CheckBoxOutlineBlank, Save } from "@mui/icons-material"
import { Input } from "@mui/material"
import { useState } from "react"
import { updateTopic } from "../../api/http"

const Card = ({ topic, userId, onClick, personalSelectedItem, setPersonalSelectedItem, handleTopicUpdate }) => {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(topic.name)
  
  const handleSaving = (e) => {
  if (e?.key && e.key !== "Enter") return;

  updateTopic({ _id: topic._id, name: editValue })
    .then((data) => {
      setEditing(false);
      handleTopicUpdate(data.topic); // dispatch to Redux
    })
    .catch((err) => console.error("Topic update failed:", err.message));
};


  return <li className="topic-card">
    
    <div className="topic--meta topic--language-and-owner">
        <div>{topic.language?.slice(0, 2)}</div>
        <div className="controls">
          { personalSelectedItem.length > 0 && 
              (personalSelectedItem.includes(topic._id) ? 
                    <CheckBox onClick={() => setPersonalSelectedItem(prev => prev.filter(id => id !== topic._id))}/> : 
                    <CheckBoxOutlineBlank onClick={() => setPersonalSelectedItem([...personalSelectedItem, topic._id])}/>
              ) 
          }
          { personalSelectedItem.length < 1 && <Delete onClick={() => setPersonalSelectedItem([topic._id])}/>}
          { editing ? <Save onClick={handleSaving} /> : <Edit onClick={() => setEditing(true)}/>}
          <Share />
        </div>
        <div className="menu-div">
          {topic.creator === userId && <>Yours</>}
        </div>
    </div>

    <div className="topic--name" onClick={editing ? () => null : onClick}>
      {!editing ?
        topic.name?.replaceAll("_", " ", 1) :
        <Input value={editValue} onChange={e => setEditValue(e.target.value)} color="primary" onKeyDown={handleSaving}/>
      }
    </div>

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