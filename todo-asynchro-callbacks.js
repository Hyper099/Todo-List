//Making todo - app with backend;

//First import important libraries
const { error } = require('console');
const express = require('express');
const fs = require('fs');
const path = require("path");

//declare path of todos file
const todosFilePath = path.join(__dirname, "todos.json");

//instantiate the express object 
const app = express();

//middleware 
app.use(express.json()); //convers to json 

//!Utility functions for reading and writing in todos.json;
//*Doing it asynchronously so use callbacks.
function readTodos(callback) {
   fs.readFile(todosFilePath, (err, data) => {
      if (err) {
         console.log(err);
         callback([]);
      }
      else {
         const todos = JSON.parse(data);
         callback(todos);
      }
   })
}

function writeTodos(todos, callback) {
   fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
         console.error(err);
         callback(false);
      }
      else {
         callback(true);
      }
   })
}


//!MEthods of backend
//?GET: to read all todos
app.get('/todos', (req, res) => {
   readTodos((todos) => { res.json(todos) });
})

//?POST : to create new todo
app.post('/todos', (req, res) => {
   readTodos((todos) => {
      const newTodo = {
         id: Date.now(),
         description: req.body.description,
         completed: req.body.completed
      };
      todos.push(newTodo);
      writeTodos(todos, (success) => {
         if (success) {
            res.status(201).json({ message: 'Todo added successfully', todo: newTodo });
         } else {
            res.status(500).json({ message: 'Failed to save the todo' });
         }
      });
   })
})

//?PUT : to edit a todo
app.put('/todos/:id', (req, res) => {
   const todoId = parseInt(req.params.id);
   readTodos((todos) => {
      const todoIndex = todos.findIndex(todo => todo.id === todoId);
      if (todoIndex !== -1) {
         const updatedTodo = {
            id: todoId, //remains the same
            description: req.body.description || todos[todoIndex].description,
            // completed: req.body.completed !== undefined ? req.body.completed : todos[todoIndex].completed,
            completed: req.body.completed ?? todos[todoIndex].completed,
         }

         todos[todoIndex] = updatedTodo;
         writeTodos(todos, (success) => {
            if (success) {
               res.status(200).json({ message: "succesfully updated.", todo: updatedTodo });
            }
            else {
               res.status(500).json({ message: "error while updating the todo" });
            }
         })
      }
      else {
         res.status(404).json({ message: "todo not found" });
      }
   })
})

//?DELETE : to delte a todo
app.delete('/todos/:id', (req, res) => {
   const todoId = parseInt(req.params.id);
   readTodos(todos => {
      const filteredTodos = todos.filter(todo => todo.id !== todoId);

      if (filteredTodos.length != todos.length) {
         writeTodos(filteredTodos, (success) => {
            if (success) {
               res.status(200).json({ message: "succesfully deleted." })
            }
            else {
               res.status(500).json({ message: "error while deleting the todo" });
            }
         })
      }
      else {
         res.status(404).json({ message: "todo not found" });
      }
   })
})





//! Starting server
const PORT = 3000;
app.listen(PORT, () => {
   console.log("Server is running : " + PORT);
})