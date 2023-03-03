import {
  initBridge,
  handler,
  onError,
  StatusCode,
  httpError,
  apply,
  method,
} from "bridge";
import express from "express";
// You can also use Yup or Superstruct for data validation
import z from "zod";
import dotenv from "dotenv";
import path from "path";
const mysql = require("mysql2");

if (!process.env.PORT) dotenv.config({ path: path.join(".env") });

const api = {
  port: 8080,
  projectName: "sever",
  serverUrl: "http://localhost:8080",
  dbPassword: "Lamia2612",
};

const pool = mysql.createPool({
  host: "sql926.main-hosting.eu",
  user: "u432861292_zehralouis",
  password: "Lamia2612",
  database: "u432861292_loura",
});

const promisePool = pool.promise();

const users = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query("SELECT * FROM `users`");
    return rows;
  },
});

const chat = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query("SELECT * FROM `chat2`");
    return rows;
  },
});

const addUser = handler({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(8),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `users` (username, password) VALUES('" +
        body.username +
        "','" +
        body.password +
        "')"
    );
    return { success: "Account Successfully Created!" };
  },
});

const sendMessage = handler({
  body: z.object({
    message: z.string(),
    author_id: z.number(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `chat2` (message, author_id) VALUES('" +
        body.message +
        "','" +
        body.author_id +
        "')"
    );
    return { success: "Message Successfully Sent!" };
  },
});

const privateChat = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query("SELECT * FROM `bizimchat`");
    return rows;
  },
});

const sendPrivateMessage = handler({
  body: z.object({
    content: z.string(),
    author: z.number(),
  }),
  resolve: async (data) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `bizimchat` (content, author) VALUES('" +
        data.body.content +
        "','" +
        data.body.author +
        "')"
    );
    return { success: "Message Successfully Sent!" };
  },
});

const tests = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query("SELECT * FROM `tests`");
    return rows;
  },
});

const exercices = handler({
  body: z.object({
    id: z.number(),
  }),
  resolve: async (data) => {
    const [rows] = await promisePool.query(
      "SELECT * FROM `exercices` WHERE ex_id =" + data.body.id
    );
    return rows;
  },
});

const allExercices = handler({
  body: z.object({
    offset: z.number(),
    limit: z.number(),
  }),
  resolve: async (data) => {
    const [rows] = await promisePool.query(
      "SELECT * FROM `exercices` LIMIT " +
        data.body.limit +
        " OFFSET " +
        data.body.offset
    );
    return rows;
  },
});

const addExercice = handler({
  body: z.object({
    turkish: z.string(),
    english: z.string(),
    french: z.string(),
    romanian: z.string(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `exercices` (turkish, english, french, romanian) VALUES('" +
        body.turkish +
        "','" +
        body.english +
        "','" +
        body.french +
        "','" +
        body.romanian +
        "')"
    );
    return { success: "Exercice Added Successfully!" };
  },
});

const addTest = handler({
  body: z.object({
    start: z.number(),
    end: z.number(),
    author: z.string(),
    name: z.string(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `tests` (start, end, author, name) VALUES('" +
        body.start +
        "','" +
        body.end +
        "','" +
        body.author +
        "','" +
        body.name +
        "')"
    );
    return { success: "Test Added Successfully!" };
  },
});

const lastId = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query(
      "SELECT MAX(ex_id) as last_id FROM `exercices`"
    );
    return rows;
  },
});

const lastUserId = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query(
      "SELECT MAX(users_id) as lastUserId FROM `users`"
    );
    return rows;
  },
});

const minesweeper = handler({
  body: z.object({
    board: z.string(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "UPDATE `minesweeper` SET `board` = '" +
        body.board +
        "' WHERE `minesweeper`.`board_ID` = 3"
    );
    return { success: "Board Updated Successfully!" };
  },
});

const lastPlayer = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query(
      "SELECT (board) FROM `minesweeper` WHERE board_ID = 1"
    );
    return rows[0];
  },
});

const setLastPlayer = handler({
  body: z.object({
    player: z.string(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "UPDATE `minesweeper` SET `board` = '" +
        body.player +
        "' WHERE `minesweeper`.`board_ID` = 1"
    );
    return { success: "Last Player Updated Successfully!" };
  },
});

const getLastBoard = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query(
      "SELECT (board) FROM `minesweeper`  WHERE board_ID = 3"
    );
    return rows[0];
  },
});

const setStarterPlayer = handler({
  body: z.object({
    player: z.string(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "UPDATE `minesweeper` SET `board` = '" +
        body.player +
        "' WHERE `minesweeper`.`board_ID` = 2"
    );
    return { success: "Starter Player Updated Successfully!" };
  },
});

const starterPlayer = handler({
  resolve: async (p) => {
    const [rows] = await promisePool.query(
      "SELECT (board) FROM `minesweeper` WHERE board_ID = 2"
    );
    return rows[0];
  },
});


const addDay = handler({
  body: z.object({
    date: z.string(),
    user: z.number(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "INSERT INTO `days` (date, user) VALUES ('" +
        body.date +
        "','" +
        body.user +
        "')"
    );
    return { success: "New Day Added Successfully!" };
  },
});

const updateDay = handler({
  body: z.object({
    schedule: z.string(),
    date: z.string(),
    user: z.number(),
  }),
  resolve: async ({ body }) => {
    const [insert] = await promisePool.query(
      "UPDATE `days` SET `schedule` = '" +
        body.schedule +
        "' WHERE `days`.`date` = '" +
        body.date +
        "' AND `days`.`user` = " +
        body.user +
        ";"
    );
    return { success: "Daily Schedule Updated Successfully!" };
  },
});

const getDay = handler({
  body: z.object({
    date: z.string(),
    user: z.number(),
  }),
  resolve: async ({ body }) => {
    const [rows] = await promisePool.query(
      "SELECT schedule FROM `days` WHERE `days`.`date` = '" +
        body.date +
        "' AND `days`.`user` = " +
        body.user +
        ";"
    );
    return rows[0];
  },
});

// You can have multiple endpoints for the same route with different methods with the method function
const routes = {
  users: method({ GET: users }),
  chat: method({ GET: chat }),
  adduser: method({ POST: addUser }),
  sendmessage: method({ POST: sendMessage }),
  privatechat: method({ GET: privateChat }),
  sendprivatemessage: method({ POST: sendPrivateMessage }),
  tests: method({ GET: tests }),
  exercices: method({ POST: exercices }),
  allexercices: method({ POST: allExercices }),
  addexercice: method({ POST: addExercice }),
  addtest: method({ POST: addTest }),
  lastid: method({ GET: lastId }),
  lastuserid: method({ GET: lastUserId }),
  minesweeper: method({ POST: minesweeper }),
  lastplayer: method({ GET: lastPlayer }),
  setlastplayer: method({ POST: setLastPlayer }),
  getlastboard: method({ GET: getLastBoard }),
  setstarterplayer: method({ POST: setStarterPlayer }),
  starterplayer: method({ GET: starterPlayer }),
  addday: method({ POST: addDay }),
  updateday: method({ POST: updateDay }),
  getday: method({ POST: getDay }),
};

// It is also possible to use HTTP Server
const app = express();

app.get("/", (req, res) => res.send(`Welcome on ${api.projectName}`));

app.use("", initBridge({ routes }).expressMiddleware());

app.listen(api.port, async () => {
  console.log(`Listening on port ${api.port}`);
});
