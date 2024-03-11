const express = require('express');
const app = express();
const userController = require('./routes/userController');
const listingController = require('./routes/listingController');
require('./middleware/db');

app.use(express.json());

// Mount routes
app.use('/v1/users', userController);
app.use('/v1/listings', listingController);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});