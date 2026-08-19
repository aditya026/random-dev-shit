const mongoose = require("mongoose")
//importing env file
require("dotenv").config();

// new way of connection
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
// old ways

//   mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true, << just a driver ,old parser have some inconsistency >>
//   useUnifiedTopology: true << Mongoose/MongoDB manages the connection to the MongoDB server >>
// })


module.exports = connectDB