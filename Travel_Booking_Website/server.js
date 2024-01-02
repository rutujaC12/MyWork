const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MySQL database configuration
const dbConfig = {
  host: 'localhost',  // Change this to your MySQL host
  user: 'root',       // Change this to your MySQL username
  password: 'password', // Change this to your MySQL password
  database: 'travel_booking' // Change this to your MySQL database name
};

// Endpoint to handle booking submissions
app.post('/api/bookings', async (req, res) => {
  try {
    // Extract data from the request body
    const { destination, guests, arrivalDate, departureDate, nameDetails } = req.body;

    // Validate inputs (you may add more validation)
    if (!destination || !guests || !arrivalDate || !departureDate || !nameDetails) {
      return res.status(400).json({ error: 'Invalid input. Please fill in all fields with valid data.' });
    }

    // Create a MySQL connection
    const connection = await mysql.createConnection(dbConfig);

    // Save booking to the database
    const query = 'INSERT INTO bookings (destination, guests, arrival_date, departure_date, name_details) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [destination, guests, arrivalDate, departureDate, nameDetails]);

    connection.end();

    // You can add further actions like sending confirmation emails, etc.

    res.status(201).json({ success: true, bookingId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000`);
});
