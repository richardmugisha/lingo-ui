

import { useEffect, useRef, useState } from "react";
import { createCover } from "../../../../../../api/http";
import "./Cover.css";

const Cover = ({ scene }) => {
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => scene?.imageUrl && setImage(scene.imageUrl), [scene?.imageUrl])

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
      if (!(scene._id && (file instanceof File))) return console.log("Something wrong with image upload")
      formData.append("image", file);
      try {
        await createCover(scene._id, formData);
        // Optionally handle success (e.g., show toast)
      } catch (err) {
        // Optionally handle error (e.g., show error message)
        console.log(err)
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <article
      className="scene-cover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", cursor: hovered ? "pointer" : "default" }}
    >
      {image ? (
        <img src={image} alt="cover" className="cover-img" />
      ) : (
        <div className="cover-placeholder">No image selected</div>
      )}
      {hovered && (
        <div className="cover-upload-overlay" onClick={handleUploadClick}>
          <span className="cover-plus">+</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
    </article>
  );
};

export default Cover;
