// import the model
const Todo = require("../models/Todo");

// route handler
// second way of writing export syntax
// get all todos
exports.getTodo = async(req,res) => {
    try{
        //    fetch all todos from the database
        const todos = await Todo.find({});

        // response
        res.status(200).json({
            success: true,
            data: todos,
            message: "Entire todo data is here"
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

// get single todo

exports.getTodoById = async(req,res) => {
    try{
        //    fetch todo basis of Id
        const id = req.params.id;
        const todo = await Todo.findById({_id: id})

        // if Id not found
        if(!todo) {
            return res.status(404).json({
                success: false,
                message: "No data found with given Id"
            })
        }

        // if find
         res.status(200).json({
            success: true,
            data: todo,
            message: `Todo ${id} successfully fetched`
         })


        // response
        res.status(200).json({
            success: true,
            data: todos,
            message: "Entire todo data is here"
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