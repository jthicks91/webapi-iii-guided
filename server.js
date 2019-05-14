const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const logger = require("morgan");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

//GLOBAL MIDDLEWARE - applied to every single route on API - MUST BE AT TOP OF SERVER FILE;

//built-in middleware
server.use(express.json());

// third party middleware
server.use(helmet());
server.use(logger("dev"));

//custom middleware
server.use(typeLogger);
server.use(addName);
// server.use(moodyGateKeeper);
// server.use(lockout);

//Making call to another external api in middleware//
// server.use((req, res, next) => {
//   // asynchronus call to a external weather api
//   //attach info to the req object
//   // call next

// })
//

// router
server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

//custom middleware
function typeLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || "Jordan";
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: "API Lockout!" });
}

function moodyGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({ message: "You shall not pass!" });
  } else {
    next();
  }
  // it keeps you out 1/3 of the time
  //when it decides to keep you out it sends back status 403 and message"you shall not pass"
}

// GLOBAL ERROR MIDDLEWARE - THIS NEEDS TO BE BEFORE OUR EXPORT AT THE BOTTOM
server.use((err, req, res, next) => {
  //only executes if next is called with an argument
  res.status(500).json({
    message: "bad panda",
    err
  });
});

module.exports = server;

