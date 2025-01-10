const express = require('express');
const fs = require('fs');
const path = require("path");
const filePath = path.join(__dirname, "todos.json");
const app = express();

//middleware
app.use(express.json());

//utility functions
function readTodos() {
   return new Promise((resolve, reject) => {
      try {
         fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
               reject(err);
            }
            else {
               resolve(JSON.parse(data) || []);
            }
         })
      } catch (error) {
         console.log("Error reading the file.");
      }
   })
}

function writeTodos(todos) {
   return new Promise((resolve, reject) => {
      try {
         fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
               reject({ err });
            }
            else {
               resolve();
            }
         })
      } catch (error) {
         console.log("Error writing to the file.");
      }
   })
}

//! Routes
//? GET to get all todos.
app.get('/todos', (req, res) => {
   readTodos()
      .then((todos) => {
         res.json(todos);
      })
})

//?POST : to add new todo.
app.post('/todos', (req, res) => {
   const newTodo = {
      id: Date.now(),
      ...req.body,
   }
   if (newTodo.completed === true) {
      res.json({ message: "Cannot add a todo which is already completed" });
      return;
   }
   readTodos()
      .then((todos) => {
         todos.push(newTodo);
         writeTodos(todos);
      })
      .then(() => {
         res.status(200).json({ message: "Todo Added Successfully", newTodo });
      })
})

//?PUT : to update a todo.
app.put('/todos/:id', (req, res) => {
   const todoId = parseInt(req.params.id);
   readTodos()
      .then((todos) => {
         const todoIndex = todos.findIndex(todo => todo.id === todoId);
         if (todoIndex !== -1) {
            todos[todoIndex] = {
               id: todoId,
               description: req.body.description || todos[todoIndex].description,
               completed: req.body.completed ?? todos[todoIndex].completed,
            }
            writeTodos(todos);
         }
         else {
            res.status(404).json({ message: "Todo with given id not found." });
            return;
         }
      })
      .then(() => {
         res.status(200).json({ message: "Todo updated successfully," })
      })
})

app.delete("/todos/:id", (req, res) => {
   const todoId = parseInt(req.params.id);
   readTodos()
      .then((todos) => {
         const updatedTodos = todos.filter(todo => todo.id !== todoId);

         if (updatedTodos.length == todos.length) {
            res.status(404).json({ message: "The todo with given id Not Found." });
            return;
         }

         writeTodos(updatedTodos);
      })
      .then(() => {
         res.status(200).json({ message: "Todo with id " + todoId + "Succfully deleted." });
      })
})



//! Start Server
const PORT = 3000;
app.listen(PORT, () => {
   console.log("Server is running at : " + PORT);
})