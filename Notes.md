# Notes

## MERN Stack Development Map

- FrontEnd

  - React JS --> (Express Web Framework)
    - Where to create user interface and make requests we need

- BackEnd

  - Node JS web server

    - Express Web Framework --> (Mongoose)

      - Where we create all of our endpoints
      - Have specific endpoints to create/delete tickets
      - Log a user in / Register use ect...

    - Mongoose --> (MongoDB)
      - Node JS web server
        - We use Mongoose to access data and add data (to MongoDB)
        - Mongoose is an ODM => an Object Data Mapper
        - Gives us bunch of easy to use functions to connect to the DB

- MongoDB
  - Database Management
    - Store our data here
    - Tickets collection, User collection ect

Img: https://www.bocasay.com/how-does-the-mern-stack-work/

## Project Road Map Notes

---

- Run `npm init`

  - In **package.json** have entry point as **server.js**

    ```
    entry point: (index.js) server.js
    {
    "name": "support-desk",
    "version": "1.0.0",
    "description": "Support ticket app",
    "main": "server.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    ```

### API & Backend Authentication

---

#### Server File Structure Guide

---

- Have an API that has a couple endpoints

  - One to register a user, Hash their password and put them in the database
  - Second, send back a JSON web token to the front end
  - We'll have a login route to send an email password validate against the DB
    - If it validates send back JSON web token

- npm init, have package.json in root folder

  - Change package.json start
    - `"start": "node backend/server.js"`

- git init

  - create a `.gitignore` file
  - add in `node_modules` and `.env `

- Installations
  - `npm i express dotenv mongoose colors bcryptjs`
  - Install Dev dependencies
    - ` npm i -D nodemon`
    - Add in server script
    ```
      "scripts": {
        "start": "node backend/server.js",
        "server": "nodemon backend/server.js"
      },
    ```

#### Express Server Setup Guide

- Create a server.js file

  - Require express, dotenv
  - Keep PORT value inside **.env File**

    - Call value from server.js from .env by
      - `PORT = process.env.PORT`

  - Create Routes, example
    ```
    app.get("/", (req, res) => {
        res.send("Test");
      //  res.json({message:"Test"})
      //  res.status(200).json({message:"Test"})
    });
    ```

### Add Routes & Controllers

- Create a seperate folder for routes

  - Inside routes create userRoutes

    - This is where we'll keep routes for users (example)
      ```
        router.post("/", (req, res) => {
          res.send("Register Route");
        });
      ```
    - Outside in the server.js we can call it
      ```
      app.use("/api/users", require("./routes/userRoutes"));
      ```

  - Don't create logic inside the router, create logic outside

- Create a seperate folder for "Controllers" which are the logic inside router

  - Create a `userController.js`

    - inside userController, we'll have our logic

      ```
      const registerUser = (req, res) => {
        res.send("Register Route");
      };
      ```

    - In our userRoutes change

      ```
      router.post("/", (req, res) => {
        res.send("Register Route");
      });
      ```

      **to**

      ```
      router.post("/", registerUser);
      ```

      - Cleans up userRoutes file
