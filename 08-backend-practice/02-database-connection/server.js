// building backend
const express = require("express")
const app = express()
const PORT = 3000

// adding middleware
const bodyParser = require("body-parser")
// powerUP app with body parser
// used to parse req.body in express
app.use(bodyParser.json())

// START the server
app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})

// Route
app.get("/", (request,response) => {
    response.send("testing  home page")
})

app.post("/api/cars", (req,res) => {
    const {name, brand} = req.body;
    console.log(name);
    console.log(brand);
    res.send("car submitted successfully!")
})


// dataBase connection
const mongoose = require("mongoose") 

mongoose.connect('mongodb://localhost:27017/myDatabase')
.then(() => {
    console.log("connection successful!")  
})
.catch((error) => {
    console.log("recieve an error", error)
})