// import the model
const Todo = require("../models/Todo");


exports.updateTodo = async(req,res) => {
    try{
        // one way to fetch ID
        // const id = req.params.id;

        // second way to fetch ID
        const { id } = req.params;

        const {title, description} = req.body;

        const todo = await Todo.findByIdAndUpdate(
            {_id: id},
            {title, description, updatedAt: Date.now()},

        )

        res.status(200).json({
            success: true,
            data: "Updated successfully",
            message: `Todo ${id} data successfully changed`

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
