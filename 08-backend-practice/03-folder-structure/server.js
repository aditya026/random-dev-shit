const express = require("express")
const app = express()

// load config file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// middleware to parse json req.body
app.use(express.json())


// import routes for TODO api
const todoRoutes = require("./routes/todoRoutes")
// mount the todo API routes
app.use("/api/v1", todoRoutes);


app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)
})

// connect to the Database
const connectDB = require("./config/db");
connectDB()


// default route
app.get("/", (req,res) => {
    res.send(`<h1>home page</h1>`)
})