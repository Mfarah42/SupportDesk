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

---

---

---

<br></br>

## **_Project Backend Road Map Notes_**

### API & Backend Authentication

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

<br> </br>

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

  - [**_Mongoose Queries_**](https://mongoosejs.com/docs/queries.html)

<br> </br>

### Error Codes

---

- 200 : Okay

  - Request has succeeded.

- 201 : Created

  - Indicates the request has succeeded and new resource has been created.

- 400 : Bad Request

  - The request could not be undsertood by the serer due to incorrect syntax.

- 401 : Unauthorized
  - Indicates that the request requires user athentication information.
  - The client may repeat the request witha suitable Authorization header field.

<br> </br>

### Login & Create JWT

---

- Work on **_loginUser_** in `userController`

  - Check if user is in the db
    ```
      const user = await findOne({email})
    ```
  - Check if user login information is correct
    ```
        // If the user is found and password matches
          if (user && await bcrypt.compare(password,user.password)){
            res.status(200).json({
              _id: user._id,
              name: user.name,
              email: user.email,
            });
          }else{
            res.status(401)
            throw new error("Invalid email or password")
          }
    ```

- JSON Web Token

  - Review

    - self contained way for securely transmitting information as JSON object
    - JWT's can be signed using a secret
      - exp: HMAC algorithm
      - or public/private key pair using RSA or ECDSA

  - **_JWT structure ` xxxxx.yyyyyy.zzzzz`_**

    - Consists of **_three parts_** seperated by dots

      - **_Header_**
        - Consists of two parts
          - type of token, which is JWT
          - signing algorithm being used, exp HMAC
            ```
              {
                "alg": "HS256",
                "typ": "JWT"
              }
            ```
      - **_Payload_**

        - Second part, contains the claims
          - Claims are statements about an entity(typically, the user), and additional data
        - There are three types of **_claims_**

          - Registered
            - These are predefined claims which are not mandatory but recomm.
            - Some of them are
              - iss(issuer)
              - exp (experation time)
              - sub (subject)
          - Public
            - Can be defined as a URI
          - Private
            - Custom claims created to share info between parties

          Example of a payload

          ```
              {
                "sub": "1234567890",
                "name": "John Doe",
                "admin": true
              }
          ```

      - **_Signature_**
        - To create the signature part
          - Take the encoded header, encoded payload, a secret,
            the algorithm specified in the header, and sign that.

<br></br>

- JWT

  - ` jwt.sign(payload, secretOrPrivateKey, [options, callback])`
  - **_payload_** could be an object literal, buffer or string representing valid JSON -` jwt.io`

    - ```
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDQ3MzY4MTU5MjgxZWRlNWNmYTE5MiIsImlhdCI6MTY0ODY1MzE2MCwiZXhwIjoxNjUxMjQ1MTYwfQ.-FmpLtL_a22jx3LlfVvmqVU1EiUaXoj8KucX7ohzU-s
      ```

      ```
      Header: {
                "alg": "HS256",
                "typ": "JWT"
              }

      Payload: {
                  "id": "62447368159281ede5cfa192",
                  "iat": 1648653160,
                  "exp": 1651245160
               }

      ```

<br> </br>

### Protect Routes & Authentication

---

- Create a middleware file calleed `authMiddleware.js`
- Inside

  - import jwt to authorize token
  - import asyncHandler
  - import User schema model

  - Create protect function
    ```
      const protect = asyncHandler(async(req,res, next)=>){}
    ```
    - Check if req.header.authorization exists
    - Grab the token
    - Verify token
      ```
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ```

#### BackEnd file creation order

server.js => **_routes Folder_** => userRoutes  
=> **_config Folder_** => db => **_controllers Folder_**  
=> userController => **_models Folder_** => userModels  
=> **_middleware folder_** => authMiddleware

---

---

---

<br></br>

## **_Project FrontEnd Road Map Notes_**

### Frontend Authentication

---

- `npx create-react-app frontend --template redux`

- Inside root **package.json**

  - Add `"client": "npm start --prefix frontend"` to scripts
  - install `npm i concurrently`
    - Runs backend and frontend at the same time
    - add ` "dev": "concurrently \"npm run server\" \"npm run client\""` to script
    - ``npm run dev ` will run both backend and frontend

- Inside frontend
  - install `npm i react-router-dom react-toastify axios react-icons react-modal `

### Headers & Initial Pages

---

- Create pages folder and component folder
  - Inside pages folder
    - Create Home, Login, Registration
  - Inside component folder
    - Create Header component
- Inside App.js file

  - Create Routes and Paths

    ```
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>

    ```

  ### Home, Login & Register UI

  ***

  - Create state that grabs all of the form data
  - Destructor state values
  - ` const { name, email, password, password2 } = formData;`
  - [Dynamically update object property](https://stackoverflow.com/questions/50376353/why-we-need-to-put-e-target-name-in-square-brackets)

  - ```
      const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
    ```
    - `[e.target.name]: e.target.value,`

### Redux Setup & Auth Slice

---

- Create Features folder

  - Create auth folder

    - Create authSlice

      - create initialState object
      - set them all to null or false or empty
      - createSlice({}) ?

    - Any reducer we create, we bring it in to store

- **Expand on this more**

### Hook Register Form To Redux

- Inside authSlice
  - Create a register and set that to createAsyncThunk
    - createAsyncThunk is a function that handles async data.
- Inside Register
  - Hooks being brought in
  - useSelector
    - Allows you to extract data from Redux store state
