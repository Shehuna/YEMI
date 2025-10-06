import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Modal from '../Modals/Modal';
import logo from '../../assets/images/avatar.png';

const UserManagement = () => {
     const [isAddUserOpen, setIsAddUserOpen] = useState(false);
     const [isEditUserOpen, setIsEditUserOpen] = useState(false);
     const [isChangeUserPassOpen, setIsChangeUserPassOpen] = useState(false);
     const [isChangeUserStatusOpen, setIsChangeUserStatusOpen] = useState(false);
     const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
     const [selectedUser, setSelectedUser] = useState('');
     const [users, setUsers] = useState([]);
     const [userId, setUserId] = useState('')

     const [formData, setFormData] =useState({
        })
     const [errors, setErrors] = useState({});
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [newPass, setNewPass] = useState('')
     const [confirmNewPass, setConfirmNewPass] = useState('')

     const API_URL = process.env.REACT_APP_API_BASE_URL
  
     useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
            if ((isEditUserOpen || isChangeUserStatusOpen) && selectedUser) {
                const user = users.find(u => u.id === parseInt(selectedUser));
                if (user) {
                    setFormData({
                        Fname: user.fname,
                        Lname: user.lname,
                        UserName: user.userName,
                        Email: user.email,
                        Status: user.status,
                        profilePicturePath: user.profilePicturePath
                    })
                }
            } else {
                setFormData({
                    Fname: '',
                    Lname: '',
                    UserName: '',
                    Email: '',
                    Password: '',
                    profilePicturePath: null
                })
            }
        }, [isEditUserOpen, isChangeUserStatusOpen, selectedUser, users]);

    const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    if(name === 'profilePicturePath'){
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
    const response = await fetch(`${API_URL}/api/UserManagement/CreateUser`, {
      method: 'POST',
      body: formDataObj
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    toast.success('User created successfully!');
    setIsAddUserOpen(false)
    fetchUsers()
    setFormData({
        Role: 'Admin'
    })
  
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user. Please try again.');
  }
};

   const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/UserManagement/GetUsers`);
      
      if (!response.ok) {
        throw new Error('Error fetching users data!');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
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
    const response = await fetch(`${API_URL}/api/UserManagement/UpdateUser/${selectedUser}`, {
      method: 'PUT',
      body: formDataObj
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    toast.success('User Updated successfully!');
    setIsEditUserOpen(false)
    fetchUsers()
  } catch (error) {
    toast.error('Failed to update user. Please try again.');
  }
};

  const handleDelete = async () => {
    
    try {
        const response = await fetch(`${API_URL}/api/UserManagement/DeleteUser/${selectedUser}`, 
            {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
            throw new Error('Error Deleting User');
            }
        setIsDeleteUserConfirmOpen(false)
        toast.success("User deleted Permanently")
        fetchUsers()
    } catch (error) {
        setError(error.message);
        toast.error(error)
    } 
  }

  const handlePasswordChange = async (e) =>{
        e.preventDefault()
        if(newPass === confirmNewPass){
            try {
         const response = await fetch(`${API_URL}/api/UserManagement/ChangePassword/${selectedUser}`, 
            {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedUser,
                newPassword: newPass,
            })
          }
        );

        if (!response.ok) {
            throw new Error('Error updating password');
            }
        setIsChangeUserPassOpen(false)
        toast.success("Password changed successfully")
        fetchUsers()
            } catch (error) {
                setError(error.message);
                toast.error(error)
            }  
        }else{
            toast.error('Passwords do not match')
        }
    }

  return (
    <div className="settings-content">
                <div className="settings-action-buttons">
                    <button className="btn-primary" onClick={() => setIsAddUserOpen(true)}>
                            Add 
                    </button>
                    <button className="btn-secondary" onClick={() => setIsEditUserOpen(true)} disabled={!selectedUser}>
                            Edit 
                    </button>
                    <button className="btn-secondary" onClick={() => setIsChangeUserPassOpen(true)} disabled={!selectedUser}>
                            Change Password
                    </button>
                    <button className="btn-secondary" onClick={() => setIsChangeUserStatusOpen(true)} disabled={!selectedUser}>
                            Change Status
                    </button>
                    <button className="btn-danger" onClick={()=>setIsDeleteUserConfirmOpen(true)} disabled={!selectedUser}>
                            Delete
                    </button>
                </div>
    
                <div className="settings-lookup-list">
                    <h4>User Lookups</h4>
                    <select
                        size="5"
                        className="lookup-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select a User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.userName}
                                </option>
                            ))}
                    </select>
                </div>
             <Modal
            isOpen={isAddUserOpen}
            onClose={() => {
                setIsAddUserOpen(false);
            }}
            title="Add User"
            >
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
                    name="profilePicturePath"
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
        </Modal>

        <Modal
            isOpen={isEditUserOpen}
            onClose={() => {
                setIsEditUserOpen(false);
            }}
            title="Edit User"
            >
            <div className="settings-content">
      
                <div className="settings-form user-form-grid">
                
                <div className="form-group" >
                    <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                    <img style={{width: '70px', height: '70px', borderRadius: '50%'
                    }} src={formData.profilePicturePath} alt="" />
                    </div>
                    
                    <label>Profile Picture:</label>
                    <input
                    type="file"
                    name="profilePicturePath"
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
                    name="Fname"
                    value={formData.Fname}
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
                    value={formData.Lname}
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
                    value={formData.UserName}
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
                    value={formData.Email}
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
        </Modal>

        <Modal
            isOpen={isChangeUserPassOpen}
            onClose={() => {
                setIsChangeUserPassOpen(false);
            }}
            title="Change Password"
            >
             <div className="settings-form">
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Enter New Password"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmNewPass}
                        onChange={(e) => setConfirmNewPass(e.target.value)} 
                        placeholder="Confirm Password"
                    />
                </div>
                
                <div className="modal-footer">
                    <button
                        className="btn-primary"
                        onClick={handlePasswordChange}
                        disabled={!newPass || !confirmNewPass}
                    >
                        OK
                    </button>
                    <button
                        className="btn-close" 
                        onClick={()=>setIsChangeUserPassOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
        <Modal
            isOpen={isChangeUserStatusOpen}
            onClose={() => {
                setIsChangeUserStatusOpen(false);
            }}
            title="Change Status"
            >
             <div className="settings-form">
                <div className="form-group">
                    <label>User Name:</label>
                    <input
                        type="text"
                        name="UserName"
                        value={formData.UserName}
                        onChange={handleInputChange}
                        placeholder="Username"
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleInputChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                
                <div className="modal-footer">
                    <button
                        className="btn-primary"
                        onClick={handleEditeUser}
                    >
                        OK
                    </button>
                    <button
                        className="btn-close" 
                        onClick={()=>setIsChangeUserStatusOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>

        <Modal
            isOpen={isDeleteUserConfirmOpen}
            onClose={() => {
                setIsDeleteUserConfirmOpen(false);
            }}
            title="Confirm Delete"
            >
            <div><p style={{fontSize: '14', textAlign: 'center'}}>Are You sure you want to delete the selected user?</p></div>
            <div className="modal-footer">
                    <button
                        className="btn-danger"
                        onClick={handleDelete}
                    >
                        OK
                    </button>
                    <button
                        className="btn-secondary" 
                        onClick={()=>setIsDeleteUserConfirmOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
        </Modal>
    </div>
   
  )
}

export default UserManagement