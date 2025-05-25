import React, { useState } from 'react';
import './Add.css';
import { saveAgent } from '../../../../../../api/http';

const defaultImage = 'https://randomwordgenerator.com/img/picture-generator/55e1d54b4a54a514f1dc8460962e33791c3ad6e04e507441722973d4914bc5_640.jpg'

const AddNewAgent = ({ onSave, setPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    role: '',
    ethnicity: '',
    shortDescription: '',
    longDescription: '',
    image: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.ethnicity.trim()) newErrors.ethnicity = 'Ethnicity is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.longDescription.trim()) newErrors.longDescription = 'Long description is required';
    if (!formData.image) newErrors.image = 'Image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create FormData object
        const formDataToSend = new FormData();
        
        // Add all text fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('sex', formData.sex);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('ethnicity', formData.ethnicity);
        formDataToSend.append('shortDescription', formData.shortDescription);
        formDataToSend.append('longDescription', formData.longDescription);
        
        // Add the image file directly
        if (formData.image instanceof File) {
          formDataToSend.append('image', formData.image);
        }
        
        const response = await saveAgent(formDataToSend);
        setPage("single-catalog"); // Navigate back to catalog view
      } catch (error) {
        console.error('Error saving agent:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to save agent. Please try again.'
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onCancel = () => setPage("single-catalog")

  // Modify the image input handler
  const handleImageUpload = (file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file // Store the actual File object instead of base64
      }));
    }
  };

  // Update the image preview
  const [imagePreview, setImagePreview] = useState(defaultImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="add-agent-container">
      <h2>Create New Agent</h2>
      <br />
      
      <form onSubmit={handleSubmit} className="agent-form">
        <div className="form-content">
          {/* Left column */}
          <div className="form-left-column">
            <div className="agent-image">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image" className="image-upload-label">
                <img src={imagePreview} alt="Agent preview" />
                <div className="image-overlay">
                  <span>Click to change image</span>
                </div>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter agent's name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter agent's age"
                min="0"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex">Sex *</label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="">Select sex</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="supervisor">Supervisor</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ethnicity">Ethnicity *</label>
              <input
                type="text"
                id="ethnicity"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                placeholder="Enter agent's ethnicity"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="form-right-column">
            <div className="form-group">
              <label htmlFor="shortDescription">Short Description *</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Enter a brief description (max 100 characters)"
                maxLength="100"
              />
              <span className="character-count">{formData.shortDescription.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="longDescription">Long Description *</label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="Enter a detailed description"
              />
            </div>
          </div>
        </div>

        {/* Controls at the bottom */}
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Agent
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAgent;
