import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AddUser from './AddUser';
import Modal from '../Modals/Modal';
import EditUser from './EditUser';
import UpdatePassword from './UpdatePassword';

const UserManagement = () => {
     const [isAddUserOpen, setIsAddUserOpen] = useState(false);
     const [isEditUserOpen, setIsEditUserOpen] = useState(false);
     const [isChangeUserPassOpen, setIsChangeUserPassOpen] = useState(false);
     const [isChangeUserStatusOpen, setIsChangeUserStatusOpen] = useState(false);
     const [selectedUser, setSelectedUser] = useState('');
     const [users, setUsers] = useState([]);
     const [userId, setUserId] = useState('')
  

     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const API_URL = process.env.REACT_APP_API_BASE_URL
  
     useEffect(() => {
        fetchUsers();
    }, []);


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

  const handleEdit = async (userId) =>{
    setUserId(userId)
    setIsEditUserOpen(true)
  }

  const handlePasswordChange = async (userid) =>{
    setUserId(userid)
    setIsChangeUserPassOpen(true)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete the selected user?`)) {
      return;
    }
    try {
        const response = await fetch(`${API_URL}/api/UserManagement/DeleteUser/${userId}`, 
            {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

        
        toast.success("User deleted successfully")
        fetchUsers()
    } catch (error) {
        setError(error.message);
        toast.error(error)
    }
  }

  return (
    <>
    {loading ? <div>Loading...</div> : 
    <div className="settings-content">
         <div className="settings-lookup-list">
            <button className="btn-primary" onClick={() => setIsAddUserOpen(true)}>
                    Add User
                </button>
            <div className="responsive-table-container">
        <table>
          <thead>
            <tr>
                <th>User Name</th>
                <th >Email</th>
                <th>Role</th>
                <th style={{width: '70px'}}>Status</th>
               <th style={{width: '80px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users?.map(user => (
                <tr
                  key={user.id}
                 // onClick={() => handleRowClick(user)}
                  // className={selectedRow === note.id ? 'selected-row' : ''}
                  style={{ cursor: 'pointer' }}
                >
                <td >{user.userName}</td>
                <td >{user.email}</td>
                <td >{user.role}</td>
                <td >{user.status}</td>
                <td style={{width: '100px'}} className="table-actions">
                  
                  <a 
                      title="Edit" 
                      onClick={(e) => { 
                      e.stopPropagation(); 
                      handleEdit(user.id);
                    }}>
                  <i className="fas fa-edit"></i>
                </a>
                <a 
                      title="reset" 
                      onClick={(e) => { 
                      e.stopPropagation(); 
                      handlePasswordChange(user.id);
                    }}>
                  <i className="fas fa-sync-alt"></i>
                </a>
                <a 
                      title="Change Status" 
                      onClick={(e) => { 
                      e.stopPropagation(); 
                      //handleEdit(user.id);
                    }}>
                  <i className="fas fa-exchange-alt"></i>
                </a>
                <a 
                  title="Delete" 
                  onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDelete(user.id);
                  }}>
                  <i className="fas fa-trash"></i>
                 </a>
                </td>
              </tr>
             ))}  
          </tbody>
        </table>
        </div>
        </div>
    </div>}
        <Modal
            isOpen={isAddUserOpen}
            onClose={() => {
                setIsAddUserOpen(false);
            }}
            title="Add User"
            >
            <AddUser />
        </Modal>

        <Modal
            isOpen={isEditUserOpen}
            onClose={() => {
                setIsEditUserOpen(false);
            }}
            title="Edit User"
            >
            <EditUser userid={userId}/>
        </Modal>

        <Modal
            isOpen={isChangeUserPassOpen}
            onClose={() => {
                setIsChangeUserPassOpen(false);
            }}
            title="Change Password"
            >
            <UpdatePassword userid={userId}/>
        </Modal>
    </>
    
  )
}

export default UserManagement