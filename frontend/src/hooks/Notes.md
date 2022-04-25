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

    ```json
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
    ```json
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
    ```js
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
      ```js
      router.post("/", (req, res) => {
        res.send("Register Route");
      });
      ```
    - Outside in the server.js we can call it
      ```js
      app.use("/api/users", require("./routes/userRoutes"));
      ```

  - Don't create logic inside the router, create logic outside

- Create a seperate folder for "Controllers" which are the logic inside router

  - Create a `userController.js`

    - inside userController, we'll have our logic

      ```js
      const registerUser = (req, res) => {
        res.send("Register Route");
      };
      ```

    - In our userRoutes change

      ```js
      router.post("/", (req, res) => {
        res.send("Register Route");
      });
      ```

      **to**

      ```js
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
      ```js
      const registerUser = (req, res) => {
        console.log(req.body);
        res.send("Register Route");
      };
      // prints undefined, we need a body parser middleware
      ```

  - Body Parser middleware

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

    - Allows you to parse incoming request bodies in a middleware

  <br></br>

- Simple way to handle errors
  const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  ```js
      // Validation
      if (!name || !email || !password) {
        // Clients error 400
        res.status(400).json({ message: "Please include all fields" });
      }

      res.send("Register Route");
    };
  ```

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
    ```js
    const conn = await mongoose.connect(process.env.MONGO_URI);
    ```
    - export `connectDB`
- In .env file, create `MONGO_URI` variable and pass in cluster
  connection string

- Import `connectDB` to server.js

  - Run the function

    ```js
    // Connect to database
    connectDB();
    ```

<br></br>

### Register User

---

- Create a folder called **_models_**
- Create `userModel.js`

  - Create a userSchema

  ```js
  const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please, add a name"],
    },
  });
  ```

  - Takes in an **_Object of fields_**

  - export the schema

  ```js
  module.exports = mongoose.model("User", userSchema);
  ```

- In `userController.js` import **_User_**

  ```js
  const User = require("../models/userModel");
  ```

  - Import bcryptjs
  - In `registerUser` check if user exists by email
  - If they do, return 400 error and throw new error

  - Hash Password
  - Create user

  ```js
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
    ```js
    const user = await findOne({ email });
    ```
  - Check if user login information is correct
    ```js
    // If the user is found and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new error("Invalid email or password");
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
            ```js
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

          ```js
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

      ```json
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
    ```js
      const protect = asyncHandler(async(req,res, next)=>){}
    ```
    - Check if req.header.authorization exists
    - Grab the token
    - Verify token
      ```js
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

<br></br>

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

<br></br>

### Headers & Initial Pages

---

- Create pages folder and component folder
  - Inside pages folder
    - Create Home, Login, Registration
  - Inside component folder
    - Create Header component
- Inside App.js file

  - Create Routes and Paths

    ```js
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

    <br></br>

### Home, Login & Register UI

---

- Create state that grabs all of the form data

  - ```js
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      password2: "",
    });
    ```

- Destructor state values

  - ` const { name, email, password, password2 } = formData;`

- Create onChange function

  - ```js
    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
    ```

    - [Dynamically update object property](https://stackoverflow.com/questions/50376353/why-we-need-to-put-e-target-name-in-square-brackets)

    - `[e.target.name]: e.target.value,`

- Work on Login page
- Work on Home page
  - Create two links for the home page
    - Link to create a new ticket
    - Link to view tickets

<br></br>

### Redux Setup & Auth Slice

---

- Create Features folder

  - Create auth folder

    - Create authSlice.js

      - create initialState object
        - ```js
          const initialState = {
            user: null,
            isError: false,
            isSuccess: false,
            isLoading: false,
            message: "",
          };
          ```
        - set them all to null or false or empty
      - createSlice({})

        - Accepts an object of reducer functions

          - A slice name
          - initial state value
          - automatically generates a slice reducer
            - with corresponding action creators and action types
          - extraReducers
            - Allows createSlice to respond to other action types besides
              - the type is has generated

        - ```js
          export const authSlice = createSlice({
            name: "auth",
            initialState,
            reducers: {},
            extraReducers: (builder) => {},
          });
          ```
          - builder
            - Allows us to add cases

    - Any reducer we create, we bring it in to store
      - ```js
        export const store = configureStore({
          reducer: {
            auth: authReducer,
          },
        });
        ```

- **Expand on this more**

<br></br>

### Hook Register Form To Redux

- Inside authSlice.js

  - Create a register and set that to createAsyncThunk

    - createAsyncThunk is a function so that we can use async data.
    - createAsyncThunk

      - accepts an action type string
      - A function that returns a promise
        - And generates a thunk that dispatches
          - pending/fulfilled/rejected action types based on that promise

    - ```js
        export const register = createAsyncThunk(
          'auth/register,
          async (user, thunkAPI) =>{
            console.log(user)
          }
        )
      ```

- Inside Register.js

  - Hooks being brought in
  - useSelector

    - Allows you to extract data from Redux store state
    - Anything in the global state
      - ```js
        const { user, isLoading, isSuccess, message } = useSelector(
          (state) => state.auth
        );
        ```
        - useSelector takes in a function that has state passed in

  - useDispatch
    - Hook that returns a reference to the dispatch function from Redux store

"start": "set PORT=3005 && react-scripts start",

<br> </br>

### Register User

- create a try-catch block inside register

  - return authService.register(user) and pass in the user data
  - if something goes wrong

    - get the message from the backEnd and check a bunch of places
    - return thunkApi.rejectWithValue(message)

    - ```js
      async (user, thunkAPI) => {
        try {
          return await authService.register(user);
        } catch (error) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          return thunkAPI.rejectWithValue(message);
        }
      };
      ```

- In the authService.js file

  - import axios
  - define AP_URL = '/api/users'
  - make a post request to that url like we did in postman
  - ```js
      const register = async(userData) =>{
            response = await axios.post(API_URL, userData)
            // if we get back data
            if(response.data){
              // save that data in localStorage
              localStorage.setItem('user', JSON.stringify(response.data)

            }
            return response.data
          }
    ```

  - Since we're using **_createAsyncThunk (see line 625)_** , it takes in

    - accepts an **_action type_** string
      - A function that returns a promise
        - And generates a thunk that dispatches
          - `pending/fulfilled/rejected action` types based on that promise

  - Since we're using **_createAsyncThunk_** all that info "pending/fulfilled...."

    - goes in `extraReducers`

    ```js
    extraReducers: (builder) => {
      builder
        // case we wanna look at is register.pending
        // pass in another argument that's a func that takes in state
        .addCase(register.pending, (state) => {
          // what do we want when it's pending
          state.isLoading = true;
        });
    };
    ```

  - Create a reset action inside authslice reducers

    - reset the values
    - ```js
          reducers: {
            reset: (state) => {
              state.isLoading = false;
              state.isError = false;
              state.message = "";
            },
          ...
      ```

  - Inside Register.js

    - import useNavigate from react-router-dom
      - initialize useNavigate `navigate = useNavigate()`
    - import useEffect to reset data and check for errors
    - if it's successful and user datas is there, then
      - navigate('/') navigate to home
      - dispatch the reset

  - Test if everything works

    - **_Submition Error_**
      - When authservice submits post request
        - It submits to `"http://localhost:3000/api/user"`
        - We want it to submit it to the backend which is at 5000
        - go to package.json on front end
          - at the top have `"proxy": "http://localhost:5000"`
        - This will submit data to the backend
    - **_Refresh Error_**

      - When we refresh the user data is gone aka(logged out)
      - We want the user to stay logged in

        - Inside the `authSlice.js`

          - grab the user data from `localStorage`

            - we saved the user data when we submitted the post request
            - `localStorage.setItem("user", JSON.stringify(response.data));`

          - To grab the data from `localStorage`
            - `user = JSON.parse(localStorage.getItem('user')) `

<br></br>

### Logout User

- In authSlice, export logout function

  - set function to createAsyncThunk
    - createAsyncThunk takes in a Redux action type string
  - call logout from authService
  - add case to extraReducer
    - set state.user to null

- In authService

  - create a logout function
    - remove 'user' from localStorage
    - We added user data to locaStorage when registering user

- In Header component
  - add in a ternary
    - if user exists have a Logout button
      - else have Login button
  - Logout has an onClick function
    - if clicked dispatch(logout()) and dispatch(reset()) is executed

### Login User

- Start at the authSlice

  - create login function set it to createAsynThunk
  - create a try block
    - try authService.log(user)
    - catch error
      - error from response, response data, response.data.message

- In login
  - create a post request
  - if response data exists, add it to localStorage
    - local storage takes in a string so stringify response.data
  - return the response data

## **_Ticket Functionality_**

<br></br>

### Ticket Model & Routes

---

- Overview

  - create ticketModel => ticketRoutes => ticketController

- Create ticketModel
  - create ticketSchema
    - Each ticket must have a relationship between ticket and user
    - user is the relationship
    ```js
      user: {
        type: mongoose.Schema.Types.ObjectId, // relate to User ObjectId
        required: true,
        ref: "User", // This is where ObjectId is being ref from
      },
    ```
- Create ticketRoutes

### Get & Create Tickets(Backend)

- getTickets
  - We can get our user id from the JWT
  - see line 18 in authMiddleware.js
  - req.user.id prints
    ```json
    {
      "_id": "625ec474de292e3bacb89f81",
      "name": "bo",
      "email": "bo@gmail.com",
      "isAdmin": false,
      "createdAt": "2022-04-19T14:17:24.033Z",
      "updatedAt": "2022-04-19T14:17:24.033Z",
      "__v": 0
    }
    ```
- createTicket

  - get body params
    - `const { product, description } = req.body;`
    - test if they exist, otherwise return an error
  - get the user

    - `const user = await User.findById(req.user.id);`
    - test if the user exists, otherwise return an error

  - create ticket
    - we await and create ticket from ticket model
    ```js
    const ticket = await Ticket.create({
      product,
      description,
      user: req.user.id,
      status: "new",
    });
    ```
  - set status to 201 because of create
  - pass into our json the ticket

- Postman Testing endpoints

  - getTicket endpoint

    - GET request
      - http://localhost:6000/api/tickets

  - createTicket endpoint
    - Post request
      - http://localhost:6000/api/tickets
      - body
        - product
        - description

### Single Ticket, Update & Delete (Backend)

- GET single ticket; The endpoint in our ticketController

  - http://localhost:6000/api/tickets/:id

  - get the user
    - `const user = await User.findById(req.user.id);`
    - test if the user exists, otherwise return an error
  - get the ticket
    - req.params.id
    - `const ticket = await Ticket.findById(req.params.id);`
  - test whether ticket exists
    - `if (ticket.user.toString() != req.user.id)`
    - otherwise throw an error
  - test if the ticket userId is the same as the req userId

    - `if (ticket.user.toString() != req.user.id)`
    - otherwise throw a "NOT Authorized" error

  - After all these steps
    - spit out the ticket
    - `res.status(200).json(ticket);`

- DELETE single ticket; The endpoint in our ticketController

  - http://localhost:6000/api/tickets/:id

  - get the user
  - get the ticket
  - test if the ticket belongs to the right user
  - remove the ticket
    - `await ticket.remove();`

- PUT single ticket; The endpoint in our ticketController

  - http://localhost:6000/api/tickets/:id

  - get the user
  - get the ticket
  - test if the ticket belongs to the right user
  - update ticket
    - create a val updatedTicket
    - await Ticket.findByIdAndUpdate
    - pass in the id (for the right ticket)
    - pass in the body
    - pass in an object True
      - if the ticket isn't there already, create it
    - ```js
      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      ```

### Route Guard

- In pages folder
  - create `NewTicket.jsx`
  - from Home, click on Create New Ticket
    - that will take you to `http://localhost:3005/new-ticket`
  - /new-ticket is the route for `NewTicket.jsx`
- In App.js

  - bring in NewTicket and rout it's path
    - ` <Route path="/new-ticket" element={<NewTicket />} />`

- Create Hooks folder

  - create `useAuthStatus.js`
  - import useSelector

    - we need to select the user from our state
    - to see if we're logged in or not

  - create two states
    - loggedIn
      - whether we're logged in or not
    - checkingStatus
      - set to false when we check
      - on the user, whether it's logged in or not
  - get user state from redux

    - `const {user} = useSelector((state) => state.auth)`

  - useEffect to check if user is logged in ^
    - update checkingStatus
    - have useEffect go off every time you `user` is updated

- Create PrivateRoute.jsx

  - bring in loggedIn and checkingStatus states
    - `const { loggedIn, checkingStatus } = useAuthStatus();`
  - we checkStatus is true or not
    - display spinner
  - we check if logged in or not
    - `<Outlet/>` import it from react-router-dom
    - or `<Navigate to "/login">`

- In App.js
  - create a nested Route for private routes
    - ```js
      <Route path="/new-ticket" element={<PrivateRoute />}>
        // Nested route is whats protected, and must be logged in
        <Route path="/new-ticket" element={<NewTicket />} />
      </Route>
      ```

### New Ticket Form

- In NewTicket jsx
  - bring in user state from redux
  - create name, email state from user
  - create product state and description state
- Form
  - Create two sections
    - heading section
    - The "form" section
      - Non editable section
        - wrap each label and input around a form-group
          - Customer Name
          - Customer Email
      - Editable form section
        - Have a form here
          - wrap each label and input around a form-group
            - Product
            - Description of the issue
          - Submit form button

### Add Ticket To Redux

- Create ticketSlice.js

  - Every resource for redux always have

    - `isError, isSuccess, isLoading, message`
    - set up initialState
      - ```js
        const initialState = {
          tickets: [],
          ticket: {},
          isError: false,
          isSuccess: false,
          isLoading: false,
          message: "",
        };
        ```
    - create and export our slice
      - `export const ticketSlice = createSlice({....})`
      - inside reducers create reset
    - export reset by itself
    - `export {reset} = ticketSlice.actions`
    - export ticketSlice
    - `export default ticketSlice.reducer`

  - Inside _store.js_
    - import ticketReducer from ticketSlice
    - add ticket to reducer

- Create ticketService.js

### Create Ticket Functionality

- In ticketSlice.js

  - export const createTicket
  - set it equal to createAsyncThunk
  - "tickets/createTickets"
  - _How do we handle a protected route?_

    - Need to get token
    - thunkAPI, has a method to get the state
      - `getState()` => `thunkAPI.getState().auth.user.token;`

  - call ticketService and create createTicket method and pass in ticketData and token
    - need to pass token
    - access header and set authorization
    ```js
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    ```

### Fetch Ticket From Backend

- In ticketSlice.js

  - export const getTickets
  - set it equal to createAsyncThunk
    - "ticket/getAll"
    - async(\_, thunkAPI)
      - get the token from thunkAPI
      - return and await ticketService.getTickets(token)
        - make sure to pass token in as it's a protected route

- In ticketService.js

  - const getTickets = async (token)....
    - create a config object
      - add in headers and assign Authorization the token
    - create response and pass in API_URL and config
    - return response.data

- In pages folder, create Tickets.jsx
  - Here's where we display our Tickets
    - get useSelector to get tickets from redux
    - get dispatch to pass in the reset
    - get dispatch to pass in getTickets function
      - pass in nothing
  - Map through the tickets and pass each ticket to TicketItem component

### Listing Tickets In UI

- In components, create TicketItem.jsx
  - Here's where we form each row
    - display Date correctly
    - create a "View" link to display more info of the ticket -`Link to={/ticket/${ticket._id}}`

### Single Ticket Display & Close Ticket

- In App.js

  - Create protected nested Route
    - path = "/ticket/:ticketId"

- In pages create Ticket.jsx

  - dispatch getTicket function and pass in ticketId
  - create a `Close Ticket` button
  - dispatch closeTicket function and pass in ticketId

- In ticketSlice.js

  - export getTicket function
  - export closeTicket function

- In ticketService.js
  - create getTicket function
  - create closeTicket function

<br>
<br>

## Notes Functionality & Deploy

---

### Notes Backend

- In models, create noteModel.js

  - will have
    - user, ticket, text, isStaff and staffID
  - export notesSchema as Note

- In routes folder, create noteRoutes.js

  - `/api/tickets/:ticketId/notes`
  - `const router = express.Router({ mergeParams: true });`

- In ticketRoutes.js

  - Re-route into note router
  - ```js
    const noteRouter = require("./noteRoutes");
    router.use("/:ticketId/notes", noteRouter);
    ```

- In controller folder, create noteController.js

  - create getNotes

    - GET request `http://localhost:6000/api/tickets/:id/notes`
    - we need the user and ticket
    - we find the NOTE by using the ticketId
    - `const notes = await Note.find({ ticket: req.params.ticketId });`
      - we pass that as response => res.status(200).json(notes)

  - create addNote (where we create our note)
    - POST request `http://localhost:6000/api/tickets/:id/notes`
    - we need user and ticket
    - we create NOTE
    - ```js
      const note = await Note.create({
        user: req.user.id,
        ticket: req.params.ticketId,
        text: req.body.text,
        isStaff: false,
      });
      ```
    ```

    ```
