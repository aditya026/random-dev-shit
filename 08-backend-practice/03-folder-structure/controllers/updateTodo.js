// import the model
const Todo = require("../models/Todo");


exports.updateTodo = async(req,res) => {
    try{
        
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
