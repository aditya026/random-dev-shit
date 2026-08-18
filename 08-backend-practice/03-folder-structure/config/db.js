const mongoose = require("mongoose")
//importing env file
require("dotenv").config();

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("DB connection done...")
    })
    .catch((error) => {
        console.log("error aagya", error)
        console.error(error.message)
        process.exit(1)
    })
}


module.exports = connectDB