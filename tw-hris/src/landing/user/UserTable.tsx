import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  fname: string;
  mname: string;
  lname: string;
  email: string;
  birthday: string;
  contact: string;
  address: string;
  username: string;
  password: string;
  imagepath: string;
  status: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userUpdated, setUserUpdated] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, [userUpdated]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (user?: User) => {
    setIsModalOpen(true);
    setSelectedUser(user || null);
    setEditedUser(user ? { ...user } : getDefaultUser());
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editedUser?.id ? handleUpdate() : handleAdd();
  };

  const handleAdd = async () => {
    if (!editedUser) return;
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error('Failed to add user');
      await response.json();
      setUserUpdated((prev) => !prev);
      closeModal();
    } catch (error) {
      setError('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedUser) return;
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${editedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error('Failed to update user');
      await response.json();
      setUserUpdated((prev) => !prev);
      closeModal();
    } catch (error) {
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (user: User) => {
    if (!window.confirm(`Are you sure you want to deactivate ${user.fname} ${user.lname}?`)) return;
    
    try {
      setIsLoading(true);
      const updatedUser = { ...user, status: 'INACTIVE' };
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/deactivate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to deactivate user');
      await response.json();
      setUserUpdated((prev) => !prev);
    } catch (error) {
      setError('Failed to deactivate user');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultUser = (): User => ({
    id: 0,
    fname: '',
    mname: '',
    lname: '',
    email: '',
    birthday: '',
    contact: '',
    address: '',
    username: '',
    password: '',
    imagepath: '',
    status: '',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div>
      <div className="text-white p-1 flex justify-between items-center w-full top-0 left-0 z-50">
        <h1 className="text-xl"></h1>
        <nav className="hidden md:flex space-x-4 text-1xl w-auto">
          <a
            href="#"
            className="text-white hover:text-gray-300"
            onClick={() => openModal()}
          >
            Add
          </a>
          <a href="#" className="text-white hover:text-gray-300">View Details</a>
        </nav>
      </div>

      {/* Search Box */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">First Name</th>
              <th className="px-4 py-2 text-center">Middle Name</th>
              <th className="px-4 py-2 text-center">Last Name</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Birthday</th>
              <th className="px-4 py-2 text-center">Contact</th>
              <th className="px-4 py-2 text-center">Address</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                  <th className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</th>
                  <td className="px-1 py-1">{user.fname}</td>
                  <td className="px-1 py-1">{user.mname}</td>
                  <td className="px-1 py-1">{user.lname}</td>
                  <td className="px-1 py-1">{user.email}</td>
                  <td className="px-1 py-1">{user.birthday}</td>
                  <td className="px-1 py-1">{user.contact}</td>
                  <td className="px-1 py-1">{user.address}</td>
                  <td className="px-1 py-1">{user.status}</td>
                  <td className="px-1 py-1 text-center">
                    <button
                      onClick={() => openModal(user)}
                      className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeactivate(user)}
                      className="text-white bg-red-700 hover:bg-red-800 px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center px-6 py-4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-white rounded-l">
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-white rounded-r">
          Next
        </button>
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">{selectedUser ? 'Edit User' : 'Add User'}</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={editedUser?.fname || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mname" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="mname"
                  name="mname"
                  value={editedUser?.mname || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={editedUser?.lname || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser?.email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {/* Birthday Field */}
        <div className="mb-4">
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={editedUser?.birthday || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Contact Field */}
        <div className="mb-4">
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={editedUser?.contact || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Address Field */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            name="address"
            value={editedUser?.address || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>

              {/* Add other fields here */}
                

                 <div className="flex justify-end">
                 <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  {selectedUser ? 'Save Changes' : 'Add User'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md mr-2 ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500">X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;