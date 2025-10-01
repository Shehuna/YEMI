import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddUser = () => {

    const [formData, setFormData] =useState({
            Fname: '',
            Lname: '',
            UserName: '',
            Email: '',
            Password: '',
            Role: 'Admin' 
        })
    const [errors, setErrors] = useState({});

    /* const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'Fname':
        if (!value) {
          newErrors.email = 'Email is required';
        } 
        break;
      
      case 'Lname':
        if (!value) {
          newErrors.password = 'Password is required';
        } 
        break;
      
      case 'UserName':
        if (!value) {
          newErrors.password = 'Password is required';
        } 
        break;

      case 'Email':
        if (!value) {
          newErrors.password = 'Password is required';
        } 
        break;

      case 'Password':
        if (!value) {
          newErrors.password = 'Password is required';
        } 
        break;
      
      default:
        break;
    }
    setErrors(newErrors);
  }; */
    const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    if(name === 'ProfilePicture'){
      setFormData((prevData) => ({...prevData, [name]: files[0]}))
      }else{
        setFormData((prevData) => ({...prevData, [name]: value}))
      }
      /* validateField(name, value); */
    }

    const handleCreateUser = async () => {
    const formDataObj = new FormData()
    Object.keys(formData).forEach((key)=>{
      formDataObj.append(key, formData[key])
    })
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/UserManagement/CreateUser`, {
      method: 'POST',
      body: formDataObj
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    toast.success('User created successfully!');
    //alert('User created successfully!');
    setFormData({
        Role: 'Admin'
    })
  
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user. Please try again.');
  }
};
  return (
  <div className="settings-content">
    <div className="settings-form user-form-grid">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="Fname"
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="Lname"
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          name="UserName"
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="Email"
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="Password"
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
      </div>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input
          type="file"
          name="ProfilePicture"
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
      </div>
    </div>
    
    <div className="settings-action-buttons">
      <button 
        className="btn-primary" 
        onClick={handleCreateUser}
        disabled={!Object.values(formData).every(field => field !== '')}>
        Create User
      </button>
    </div>
  </div>
  )
}

export default AddUser

