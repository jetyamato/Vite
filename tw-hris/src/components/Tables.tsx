import React, { useEffect, useState } from 'react';

// Define a type for a user object (from the database)
interface User {
  id: number;
  name: string;
  email: string;
}

const Tables = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  // For editing user
  const [editedUser, setEditedUser] = useState<User | null>(null);  // For adding/editing user data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userUpdated, setUserUpdated] = useState(false); // Track when a user is updated
  const itemsPerPage = 5;  // Show 5 items per page

  // Fetch the data initially
  useEffect(() => {
    fetchUsers();
  }, [userUpdated]); // Re-fetch data when a user is updated

  // Fetch users from API
  const fetchUsers = () => {
    setIsLoading(true); // Set loading state to true
    fetch('http://localhost:5000/api/users')
      .then((response) => response.json())
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load users'); // Display error message
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  };

  // Handle opening the modal with selected user (for edit)
  const openModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setEditedUser({ ...user }); // Initialize with user data for editing
    } else {
      setSelectedUser(null);
      setEditedUser({ id: 0, name: '', email: '' }); // Set default for adding new user
    }
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setEditedUser(null);
    setError(null); // Clear any errors
  };

  // Handle input changes in the modal form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : prevUser));
  };

  // Handle form submit for adding or editing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    editedUser?.id ? handleUpdate() : handleAdd();  // Check if editing or adding
  };

  // Handle adding a new user
  const handleAdd = async () => {
    if (!editedUser) return;

    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const result = await response.json();
      console.log(result); // Handle the successful response

      // Set state to trigger data refresh
      setUserUpdated((prev) => !prev); // Toggle to trigger re-fetch

      // Close modal after add and refresh data
      closeModal();

    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user'); // Show error message
    } finally {
      setIsLoading(false); // Set loading to false after operation
    }
  };

  // Handle updating an existing user
  const handleUpdate = async () => {
    if (!editedUser) return;

    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:5000/api/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const result = await response.json();
      console.log(result); // Handle the successful response

      // Set state to trigger data refresh
      setUserUpdated((prev) => !prev); // Toggle to trigger re-fetch

      // Close modal after update and refresh data
      closeModal();

    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user'); // Show error message
    } finally {
      setIsLoading(false); // Set loading to false after operation
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Add User Button */}
       {/* Navigation Links START */}
       <div className="text-white p-1 flex justify-between items-center w-full top-0 left-0 z-50">
        <h1 className="text-xl"></h1>

        <nav className="hidden md:flex space-x-4 text-1xl w-auto">
          <a
            href="#"
            className="text-white hover:text-gray-300"
            onClick={() => openModal()}// Open the modal when the "Add" link is clicked
          >
            Add
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            View Details
          </a>
        </nav>
      </div>


      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2 text-center">ID</th>
              <th scope="col" className="px-4 py-2 text-center">Username</th>
              <th scope="col" className="px-4 py-2 text-center">Email</th>
              <th scope="col" className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center"
                >
                  <th
                    scope="row"
                    className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.id}
                  </th>
                  <td className="px-1 py-1">{user.name}</td>
                  <td className="px-1 py-1">{user.email}</td>
                  <td className="px-1 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => openModal(user)} // Open modal in edit mode
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center px-6 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-white rounded-l"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-white rounded-r"
        >
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedUser?.name || ''}
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
                  disabled={isLoading} // Disable the button when loading
                >
                  {isLoading ? 'Saving...' : selectedUser ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
