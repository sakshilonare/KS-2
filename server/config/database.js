const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true, // These options are deprecated but won't cause errors for now
        useUnifiedTopology: true, // Still being used for backward compatibility
    })
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((error) => {
        console.log("DB connection issue");
        console.error(error);
        process.exit(1); // Exit the process if connection fails
    });
};
