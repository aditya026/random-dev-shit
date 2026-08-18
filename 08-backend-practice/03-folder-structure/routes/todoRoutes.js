const express = require("express");
const router = express.Router();

// import controller
const {createTodo} = require("../controllers/createTodo")

// deffine api routes
// map route with the controller
router.post("/createTodo", createTodo)


module.exports = router;