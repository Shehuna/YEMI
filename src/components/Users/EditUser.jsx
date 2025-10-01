import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import logo from '../../assets/images/avatar.png';

const EditUser = ({userid}) => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] =useState({
                id: '',
                fname: '',
                lname: '',
                userName: '',
                email: '',
                role: '',
                status: '',
                profilePictureBase64: null
            })

    const API_URL = process.env.REACT_APP_API_BASE_URL

    useEffect(() => {
            fetchUser();
    }, []);

    const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    if(name === 'ProfilePicture'){
      setFormData((prevData) => ({...prevData, [name]: files[0]}))
      }else{
        setFormData((prevData) => ({...prevData, [name]: value}))
      }
    }

    const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/UserManagement/GetUserById/${userid}`);
      
      if (!response.ok) {
        throw new Error('Error fetching users data!');
      }
      
      const data = await response.json();
      setFormData({
          id: data.user.id,
          fname: data.user.fname,
          lname: data.user.lname,
          userName: data.user.userName,
          email: data.user.email,
          role: data.user.role,
          status: data.user.status,
          profilePictureBase64: data.user.profilePictureBase64
      })
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditeUser = async () => {
    const formDataObj = new FormData()
    Object.keys(formData).forEach((key)=>{
      formDataObj.append(key, formData[key])
    })
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/UserManagement/UpdateUser/${userid}`, {
      method: 'PUT',
      body: formDataObj
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    toast.success('User Updated successfully!');
  } catch (error) {
    toast.error('Failed to update user. Please try again.');
  }
};
  return (
    <div className="settings-content">
      
    <div className="settings-form user-form-grid">
     
      <div className="form-group" >
        <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
          <img style={{width: '70px', height: '70px', borderRadius: '50%'
          }} src={formData.profilePictureBase64 !== null ? `data:image/jpeg;base64,${formData.profilePictureBase64}` : logo} alt="" />
        </div>
        
        <label>Profile Picture:</label>
        <input
          type="file"
          name="ProfilePicture"
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
      </div>
       <div className="form-group">
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="fname"
          value={formData.fname}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lname"
          value={formData.lname}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
      </div>

      
    </div>
    
    <div className="settings-action-buttons">
      <button 
        className="btn-primary" 
        onClick={handleEditeUser}
        disabled={!Object.values(formData).every(field => field !== '')}>
        Update User
      </button>
    </div>
  </div>
  )
}

export default EditUser