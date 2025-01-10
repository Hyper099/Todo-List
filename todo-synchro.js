const express = require('express');
const fs = require('fs');
const path = require("path");
const filePath = path.join(__dirname, 'todos.json');

const app = express();

//middleware
app.use(express.json());

//?Utility Functions : 
function readTodos() {
   try {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content || []);
   }
   catch (e) {
      console.log(e);
   }
}

function writeTodos(todos) {
   try {
      fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
   } catch (e) {
      console.error(e);
   }
}

//!CRUD
//*Create -> post
//*Read -> get -> thus swill return all the todos.
//*Update -> put
//*Delete -> Delete

app.get('/todos', (request, response) => {
   try {
      const todos = readTodos();
      response.status(200).json(todos);
   } catch (err) {
      console.error(err);
   }
});

app.post("/todos", (request, response) => {
   const todos = readTodos();
   const newTodo = {
      id: Date.now(),
      description: request.body.description,
      completed: request.body.completed,
   }
   if (newTodo.completed == true) {
      response.status(400).json({ message: "Cannot add already completed task" });
      return;
   }
   todos.push(newTodo);
   writeTodos(todos);
   response.status(200).json({ message: "Todo added Successfully", todo: newTodo })
})

app.put('/todos/:id', (request, response) => {
   const todoId = parseInt(request.params.id);
   const todos = readTodos();
   const todoIndex = todos.findIndex(todo => todo.id == todoId);

   if (todoIndex == -1) {
      response.status(404).json({ message: "the todo with given id does not exist" });
      return;
   }
   else {
      todos[todoIndex] = {
         id: todoId,
         description: request.body.description || todos[todoIndex].description,
         completed: request.body.completed ?? todos[todoIndex].completed,
      }
      writeTodos(todos);
      response.status(200).json({ message: "todo updated successfully", todo: todos[todoIndex] });
   }
})

app.delete("/todos/:id", (request, response) => {
   const todoId = request.params.id;
   const todos = readTodos();
   const newTodos = todos.filter(todo => todo.id != todoId);

   if (todos.length === filteredTodos.length) {
      response.status(404).json({ message: "The todo with the given ID does not exist" });
      return;
   }

   writeTodos(newTodos);
   response.status(200).json({ message: "the todo with id " + todoId + "deleted ssuccessfully." });

})

//!STart server;
const PORT = 3000;
app.listen(PORT, () => {
   console.log("Server is running at port : " + PORT);
})