// import the model
const Todo = require("../models/Todo");

// route handler
// second way of writing export syntax
exports.createTodo = async(req,res) => {
    try{
        // extract data(title & desc) from req.body
        const {title, description} = req.body;
        
        // create new todo object and insert into the DB
        const response = await Todo.create({title,description})

        // send a JSON response with success flag 
        res.status(200).json({
            success: true,
            data: response,
            message: "Entry created Successfully"
        })
    }catch(e){
        console.log("error aagya", e)
        console.error(e)
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: e.message
        })
    }
}