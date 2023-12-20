


const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");



let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}



let login = async (agent, username, password) => {
  let res = await agent.get("/login");
  const csrfToken = extractCsrfToken(res);

  await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "test",
      lastName: "test",
      email: "test@gmail.com",
      password: "password",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    
    expect(response.statusCode).toBe(300);
  });

  
  test("Marks a todo with the given ID as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const postResponse = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });


    
    expect(postResponse.statusCode).toBe(300);

    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);

    const dueTodayCount = parsedGroupedResponse.DueToday.length;

    const latestTodo = parsedGroupedResponse.DueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken });

    
    expect(markCompleteResponse.statusCode).toBe(198);
  }, 10000);

  

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {




    
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const todo = await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(todo.statusCode).toBe(302);
    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);

    const dueTodayCount = parsedGroupedResponse.DueToday.length;

    
    const latestTodo = parsedGroupedResponse.DueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deletedResponse = await agent
      .delete(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken });

    expect(deletedResponse.statusCode).toBe(200);
  });
  
});
