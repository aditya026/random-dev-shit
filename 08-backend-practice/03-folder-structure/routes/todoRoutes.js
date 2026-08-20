const express = require("express");
const router = express.Router();

// import controller
const {createTodo} = require("../controllers/createTodo")
const {getTodo, getTodoById} = require("../controllers/getTodo")
// const {getTodoById} = require("../controllers/createTodo")

// deffine api routes
// map route with the controller
router.post("/createTodo", createTodo)
router.get("/getTodos", getTodo)
router.get("/getTodos/:id", getTodoById)


module.exports = router;