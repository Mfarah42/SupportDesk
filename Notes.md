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

---

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

---

- Create a seperate folder for routes

  - Inside routes create userRoutes

    - `router.post` or `router.get` **_"router"_** is only for defining subpaths

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

### Error & Exception Handling

---

- Add comments to what each controller function is doing
- Postman

  - In postman go to body then urlform

    - Here we can pass in the body data, and send data.(Post req)
    - In our registerUser function, we can print out the body
    - It will print undefined

            const registerUser = (req, res) => {
              console.log(req.body);
              res.send("Register Route");
            };
            // prints undefined, we need a body parser middleware

  - Body Parser middleware

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

    - Allows you to parse incoming request bodies in a middleware

  <br></br>

- Simple way to handle errors
  const registerUser = (req, res) => {
  const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
          // Clients error 400
          res.status(400).json({ message: "Please include all fields" });
        }

        res.send("Register Route");
      };

  <br></br>

- Better way to handle Errors
  - Create a middleware folder
  - create a file called errorMiddleware
  - Create an errorHandler function
  - Pass that function to a globbal middlware
  - Install express async handler
    - Handling exceptions inside of async express routes and passiing them
      to your express error handlers
    - We're using mongoose which returns a promise

<br></br>

### Connecting To The Database

---

- Create a folder called `config`
- Create a file called `db`
  - In the file db create a function called `connectDB`
    - Create a try-catch
    - mongoose returns a promise
    ```
    const conn = await mongoose.connect(process.env.MONGO_URI);
    ```
    - export `connectDB`
- In .env file, create `MONGO_URI` variable and pass in cluster
  connection string

- Import `connectDB` to server.js

  - Run the function

    ```
      // Connect to database
      connectDB();
    ```

<br></br>

### Register User

---

- Create a folder called **_models_**
- Create `userModel.js`

  - Create a userSchema

  ```
      const userSchema = mongoose.Schema({
          name: {
              type: String,
              required: [true, 'Please, add a name']
          }
      })
  ```

  - Takes in an **_Object of fields_**

  - export the schema

  ```
    module.exports = mongoose.model("User", userSchema);
  ```

- In `userController.js` import **_User_**

  ```
    const User = require("../models/userModel");
  ```

  - Import bcryptjs
  - In `registerUser` check if user exists by email
  - If they do, return 400 error and throw new error

  - Hash Password
  - Create user

  ```
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

  ```
