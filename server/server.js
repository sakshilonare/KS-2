const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cropRoute = require('./routes/cropRoute.js'); // Crop route
const bidRoute = require('./routes/bidRoute.js');   // Bid route
const buyerRoute = require('./routes/buyerRoute.js'); // Buyer route
const adminRoute = require('./routes/adminRoute.js'); // Admin route
const farmerRoute=require('./routes/farmerRoute.js');
const auctionRoute=require('./routes/auctionRoute.js');
const commissionRoute=require('./routes/commissionRouter.js');
const {endedAuctionCron} = require("./automation/endedAuctionCron.js");
const {verifyCommissionCron} = require("./automation/verifyCommissionCron.js");

const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Middleware for file upload
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to Crop Auction Application!');
});

// Use routes
app.use('/api/crop', cropRoute);
app.use('/api/bids', bidRoute);
app.use('/api/buyer', buyerRoute);
app.use('/api/admin', adminRoute);
app.use('/api/farmer', farmerRoute);
app.use('/api/auction', auctionRoute);
app.use('/api/commission', commissionRoute);

endedAuctionCron();
verifyCommissionCron();

// Connect to Cloudinary
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
