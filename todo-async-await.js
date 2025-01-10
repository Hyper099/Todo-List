const fs = require('fs').promises;
const path = require("path");
const filePath = path.join(__dirname, "todos.json");
const app = express();

//middleware
app.use(express.json());

//utility functions
async function readTodos() {
   try {
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content || []);
   }
   catch (e) {
      console.error(e);
   }
}

async function writeTodos(todos) {
   try {
      await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
   }
   catch (e) {
      console.error(e);
   }
}

//? GET to get all todos.
app.get('/todos', async (req, res) => {
   try {
      const todos = await readTodos();
      res.json(todos);
   } catch (error) {
      res.status(500).json({ message: "Error fetching todos" });
   }
});

//?POST : to add new todo.
app.post('/todos', async (req, res) => {
   const newTodo = {
      id: Date.now(),
      ...req.body,
   }
   if (newTodo.completed === true) {
      return res.json({ message: "Cannot add a todo which is already completed" });
   }
   try {
      const todos = await readTodos();
      todos.push(newTodo);
      await writeTodos(todos);
      res.status(200).json({ message: "Todo Added Successfully", newTodo });
   } catch (error) {
      res.status(500).json({ message: "Error adding todo" });
   }
});

//?PUT : to update a todo.
app.put('/todos/:id', async (req, res) => {
   const todoId = parseInt(req.params.id);
   try {
      const todos = await readTodos();
      const todoIndex = todos.findIndex(todo => todo.id === todoId);
      if (todoIndex !== -1) {
         todos[todoIndex] = {
            id: todoId,
            description: req.body.description || todos[todoIndex].description,
            completed: req.body.completed ?? todos[todoIndex].completed,
         }
         await writeTodos(todos);
         res.status(200).json({ message: "Todo updated successfully" });
      } else {
         res.status(404).json({ message: "Todo with given id not found." });
      }
   } catch (error) {
      res.status(500).json({ message: "Error updating todo" });
   }
});

app.delete("/todos/:id", async (req, res) => {
   const todoId = parseInt(req.params.id);
   try {
      const todos = await readTodos();
      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      if (updatedTodos.length === todos.length) {
         return res.status(404).json({ message: "The todo with given id Not Found." });
      }

      await writeTodos(updatedTodos);
      res.status(200).json({ message: `Todo with id ${todoId} Successfully deleted.` });
   } catch (error) {
      res.status(500).json({ message: "Error deleting todo" });
   }
});

//! Start Server
const PORT = 3000;
app.listen(PORT, () => {
   console.log("Server is running at : " + PORT);
});