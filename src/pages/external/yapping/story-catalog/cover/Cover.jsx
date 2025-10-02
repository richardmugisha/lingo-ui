import { useRef, useState, useEffect } from "react"
import { CheckBoxOutlineBlank, CheckBox, Delete, MoreVert } from "@mui/icons-material"
import { Button } from "@mui/material"
import "./Cover.css"
import { createStoryCover } from "../../../../../api/http"


const Cover = ({ story, deleteList, setDeleteList, setStorySettings }) => {
    const imageInputRef = useRef(null)

    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        if (story?.imageUrl) setImage(story.imageUrl)
    }, [story?.imageUrl])

    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Show preview
        const reader = new FileReader();
        reader.onload = (ev) => {
        setImage(ev.target.result);
        };
        reader.readAsDataURL(file);

        // Send to backend
        const formData = new FormData();
        if (!(story._id && (file instanceof File))) return console.log("Something wrong with image upload")
        formData.append("image", file);
        try {
            await createStoryCover(story._id, formData);
            // Optionally handle success (e.g., show toast)
        } catch (err) {
            // Optionally handle error (e.g., show error message)
            console.log(err)
        }
    }
    };

    const navigateToStory = (e, story) => {
        e.target.parentNode.parentNode.classList.add("active")
        setTimeout(() => {
            setStorySettings(prev => prev.rebuild({
            mode: "create",
            step: "create",
            outline: story.outline,
            _id: story._id,
            details: story.details,
            ...story
            }))
        }, 300)
    };


  return (
    <section  key={story._id}  className="cover" >
        <img src={ image || "/story-cover-2.png" } />
        <section>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={imageInputRef}
                    onChange={handleImageChange}
                />
                { hovered &&
                    <div className="controls">
                        <button onClick={e => { setHovered(false); imageInputRef.current.click() }}>
                            Add a cover
                        </button>
                        <button>Share</button>
                        <button>Adapt</button>
                        <button>Make private</button>
                        <button onClick={() => setDeleteList([...deleteList, story._id])}>Delete story</button>
                    </div>
                }
                <span className="extra">
                    <MoreVert onClick={() => setHovered(!hovered)}/>
                </span>
                
                {/* { deleteList.length > 0 ?
                    deleteList.includes(story._id) ? 
                            <CheckBox onClick={() => setDeleteList(prev => prev.filter(id => id !== story._id))}/> : 
                            <CheckBoxOutlineBlank onClick={() => setDeleteList([...deleteList, story._id])}/>
                    : <span></span>
                }
                { deleteList.length < 1 && <Delete onClick={() => setDeleteList([story._id])}/> } */}
            </div>
            <p
                onClick={e => navigateToStory(e, story)}
                >{story.script?.title || story.title}
            </p>
        </section>
    </section>
  )
}

export default Cover
