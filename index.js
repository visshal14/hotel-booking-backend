const express = require('express');
require('dotenv').config({ path: './config/dev.env' })
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = process.env.PORT || 3000;

const { swaggerUi, swaggerSpec } = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// routes
app.use('/auth', authRoutes);
app.use('/hotels', hotelRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});// < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->