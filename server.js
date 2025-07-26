    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors'); // 1. Import the cors package

    const bookRoutes = require('./routes/books');
    const userRoutes = require('./routes/users');

    const app = express();
    const PORT = 5001; // Or whatever port you are using

    // --- MIDDLEWARE ---
    app.use(cors()); // 2. Use the cors middleware
    app.use(bodyParser.json());


    // --- ROUTES ---
    app.use('/books', bookRoutes);
    app.use('/users', userRoutes);


    // --- START SERVER ---
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    