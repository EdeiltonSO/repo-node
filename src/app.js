const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  }

  repositories.push(newRepository);
  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  if(request.body.likes) return response.status(400).json({ likes: 0 });

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) return response.status(400).json({ error: 'bad request' });

  const repo = { id, title, url, techs };
  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) 
    return response.status(400).json({ error: 'bad request' });

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(repo => repo.id === id);
  if(!repo) 
    return response.status(400).json({ error: "repository not found!" });
  repo.likes++;

  return response.json({ likes: repo.likes });
});

module.exports = app;
