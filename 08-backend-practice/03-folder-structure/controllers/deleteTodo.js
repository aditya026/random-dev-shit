const Todo = require("../models/Todo");
const todo = require("../models/Todo")


exports.deleteTodo = async (req,res) => {
    try{
        const { id } = req.params;

        await Todo.findByIdAndDelete(id)


        res.status(200).json({
            success: true,
            data: "delete successfully",
            message: `Todo ${id} data successfully deleted`

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