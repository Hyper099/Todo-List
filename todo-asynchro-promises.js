<<<<<<< Tabnine <<<<<<<
const express = require('express');
const fs = require('fs');//-
const fs = require('fs').promises;//+
const path = require("path");
const filePath = path.join(__dirname, "todos.json");
const app = express();

//middleware
app.use(express.json());

//utility functions
function readTodos() {//-
   return new Promise((resolve, reject) => {//-
      try {//-
         fs.readFile(filePath, "utf8", (err, data) => {//-
            if (err) {//-
               reject(err);//-
            }//-
            else {//-
               resolve(JSON.parse(data) || []);//-
            }//-
         })//-
      } catch (error) {//-
         console.log("Error reading the file.");//-
      }//-
   })//-
async function readTodos() {//+
   try {//+
      const data = await fs.readFile(filePath, "utf8");//+
      return JSON.parse(data) || [];//+
   } catch (error) {//+
      console.log("Error reading the file:", error);//+
      throw error;//+
   }//+
}

function writeTodos(todos) {//-
   return new Promise((resolve, reject) => {//-
      try {//-
         fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {//-
            if (err) {//-
               reject({ err });//-
            }//-
            else {//-
               resolve();//-
            }//-
         })//-
      } catch (error) {//-
         console.log("Error writing to the file.");//-
      }//-
   })//-
async function writeTodos(todos) {//+
   try {//+
      await fs.writeFile(filePath, JSON.stringify(todos, null, 2));//+
   } catch (error) {//+
      console.log("Error writing to the file:", error);//+
      throw error;//+
   }//+
}

//! Routes
//? GET to get all todos.
app.get('/todos', (req, res) => {//-
   readTodos()//-
      .then((todos) => {//-
         res.json(todos);//-
      })//-
})//-
app.get('/todos', async (req, res) => {//+
   try {//+
      const todos = await readTodos();//+
      res.json(todos);//+
   } catch (error) {//+
      res.status(500).json({ message: "Error fetching todos" });//+
   }//+
});//+

//?POST : to add new todo.
app.post('/todos', (req, res) => {//-
app.post('/todos', async (req, res) => {//+
   const newTodo = {
      id: Date.now(),
      ...req.body,
   }
   if (newTodo.completed === true) {
      res.json({ message: "Cannot add a todo which is already completed" });//-
      return;//-
      return res.json({ message: "Cannot add a todo which is already completed" });//+
   }
   readTodos()//-
      .then((todos) => {//-
         todos.push(newTodo);//-
         writeTodos(todos);//-
      })//-
      .then(() => {//-
         res.status(200).json({ message: "Todo Added Successfully", newTodo });//-
      })//-
})//-
   try {//+
      const todos = await readTodos();//+
      todos.push(newTodo);//+
      await writeTodos(todos);//+
      res.status(200).json({ message: "Todo Added Successfully", newTodo });//+
   } catch (error) {//+
      res.status(500).json({ message: "Error adding todo" });//+
   }//+
});//+

//?PUT : to update a todo.
app.put('/todos/:id', (req, res) => {//-
app.put('/todos/:id', async (req, res) => {//+
   const todoId = parseInt(req.params.id);
   readTodos()//-
      .then((todos) => {//-
         const todoIndex = todos.findIndex(todo => todo.id === todoId);//-
         if (todoIndex !== -1) {//-
            todos[todoIndex] = {//-
               id: todoId,//-
               description: req.body.description || todos[todoIndex].description,//-
               completed: req.body.completed ?? todos[todoIndex].completed,//-
            }//-
            writeTodos(todos);//-
   try {//+
      const todos = await readTodos();//+
      const todoIndex = todos.findIndex(todo => todo.id === todoId);//+
      if (todoIndex !== -1) {//+
         todos[todoIndex] = {//+
            id: todoId,//+
            description: req.body.description || todos[todoIndex].description,//+
            completed: req.body.completed ?? todos[todoIndex].completed,//+
         }
         else {//-
            res.status(404).json({ message: "Todo with given id not found." });//-
            return;//-
         }//-
      })//-
      .then(() => {//-
         res.status(200).json({ message: "Todo updated successfully," })//-
      })//-
})//-
         await writeTodos(todos);//+
         res.status(200).json({ message: "Todo updated successfully" });//+
      } else {//+
         res.status(404).json({ message: "Todo with given id not found." });//+
      }//+
   } catch (error) {//+
      res.status(500).json({ message: "Error updating todo" });//+
   }//+
});//+

app.delete("/todos/:id", (req, res) => {//-
app.delete("/todos/:id", async (req, res) => {//+
   const todoId = parseInt(req.params.id);
   readTodos()//-
      .then((todos) => {//-
         const updatedTodos = todos.filter(todo => todo.id !== todoId);//-
   try {//+
      const todos = await readTodos();//+
      const updatedTodos = todos.filter(todo => todo.id !== todoId);//+

         if (updatedTodos.length == todos.length) {//-
            res.status(404).json({ message: "The todo with given id Not Found." });//-
            return;//-
         }//-
      if (updatedTodos.length === todos.length) {//+
         return res.status(404).json({ message: "The todo with given id Not Found." });//+
      }//+

         writeTodos(updatedTodos);//-
      })//-
      .then(() => {//-
         res.status(200).json({ message: "Todo with id " + todoId + "Succfully deleted." });//-
      })//-
})//-
      await writeTodos(updatedTodos);//+
      res.status(200).json({ message: `Todo with id ${todoId} Successfully deleted.` });//+
   } catch (error) {//+
      res.status(500).json({ message: "Error deleting todo" });//+
   }//+
});//+

//-
//! Start Server
const PORT = 3000;
app.listen(PORT, () => {
   console.log("Server is running at : " + PORT);
})//-
});//+
>>>>>>> Tabnine >>>>>>>// {"source":"chat"}