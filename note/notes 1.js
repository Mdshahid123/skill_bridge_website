//first time user send a request to login page : http://localhost:3000/login

// step:1

//Before route executes:
app.get("/login",...)

//session middleware runs first s

app.use(session(...))=>  function sessionMiddleware(req, res, next) {
    const sid = req.header.cookie

    if (sid) {
        req.session = loadSessionFromStore(sid);
    } else {
        req.session = {}; // temporary session object
    }

    next();
}

// step:2 
//Middleware Checks Cookie
(req.headers.cookie)

//But first time user has NO cookie.

//Middleware understands:

"This is a new user"


// step:3

// Middleware Creates Empty Session


req.session = {}

//Now request object becomes:

req = {
   session: {}
}


//step:4 Route Executes(/login)
req.session.isLogin = true;
req.session.user =existingUser;
req.session.save() //it will save the session data in the database and create a sessionId and signature and send it to the browser as cookies


//So session becomes:
req.session = {
   user: "Shahid",
   isLogin: true
}



// -------------------second time-----------------------------------------//






// --------------------- resave and saveunitilized----------------------------------------//



//  saveUninitialized: false
Empty session?
     |
    Yes
     |
Don't save it




// resave: false

Session already exists
     |
Did anything change?
     |
    No
     |
Don't save again




