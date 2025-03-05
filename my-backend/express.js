const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Dummy users data (replace with actual database logic)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// PUT route for updating a user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id); // Extract the ID from the URL
  const updatedUser = req.body; // Get the updated user data from the request body

  // Find the user by ID and update it
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser }; // Update the user data
    res.json(users[index]); // Respond with the updated user
  } else {
    res.status(404).send('User not found'); // Send a 404 if the user is not found
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
