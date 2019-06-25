const express = require("express");

const server = express();

server.use(express.json());

// Query = ?teste=1
// Params = /teste/1
// Request body = { "teste": 1}

// CRUD -> CREATE, READ, UPDATE, DELETE

const users = ["Gustavo", "Guilherme", "Samuel"];

// Middlewares ------------------------------------------------------------------------------------- Inicio Middlewares
// Sempre que uma funcao possuir o formato (req, res, next=null) => {}, ela é um middleware
// Criando um MIDDLEWARE GLOBAL que vai passar por todas as requisições
// retornar informacoes e duracao do request

// Global Middlewares --------------------------------------- Global Middlewares
server.use((req, res, next) => {
  console.time("Request");
  console.log({
    metodo: req.method,
    URL: req.url,
    params: req.params,
    queryParams: req.query,
    body: req.body
  });

  next();

  console.timeEnd("Request");
});
// Global Middlewares --------------------------------------- Global Middlewares

// Local Middlewares ----------------------------------------- Local Middlewares
function checkUserIfExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User's name required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  req.user = user;
}
// Local Middlewares ----------------------------------------- Local Middlewares

// Middlewares ---------------------------------------------------------------------------------------- Fim Middlewares

server.get("/teste/:id", (req, res) => {
  // req -> dados da requisicao
  // res -> response, return to front
  const { nome } = req.query;
  const message = `Hello ${nome || "world"}`;
  const { id } = req.params;

  console.log({ message, id });
  return res.send({ message, id });
});

// CRUD ---------------------------------------------------------------------------------------------------------- CRUD
server.get("/users/:index", checkUserInArray, (req, res) => {
  // const { index } = req.params;
  // return res.json(users[index]);
  return res.json(req.user);
});

server.get("/users", (req, res) => {
  return res.json(users);
});

server.post("/users", checkUserIfExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserIfExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users[index]);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json();
});
// CRUD ---------------------------------------------------------------------------------------------------------- CRUD

server.listen(3000);
