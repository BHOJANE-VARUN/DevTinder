const express = require("express");

const app = express();
// (ab)+ ==== {ab,abab,ababab,abababab,abababababab}
// * === any string of any length, e.x. ab*c === {abc,abac,absdldc,abxxc}
// (ab)? === ab | epsilon

// app.use("/a(ab)?c",(req,res)=>{
//     res.send("hello world");
// })
//if no responce then postman get stuck
// app.use("/user",(req,res)=>{
//     console.log("first route handler");
//     //res.send("hi user");
// })
// app.use("/user",(req,res,next)=>{
//     console.log("first route handler");
//     res.send("hi user"); //first responce 
//     next();//next route handler
// },(req,res)=>{ // we can as much route handler as we want
//     console.log("second route handler");
//     res.send("hi user2"); // error because connection socket is already closed
// })
// app.use("/user",(req,res,next)=>{
//     console.log("first route handler"); 
//     next();//there the control goes to second route handler
//     res.send("hi user"); //after second route handle this will be execute and throw the same error
// },(req,res)=>{ // we can as much route handler as we want
//     console.log("second route handler");
//     res.send("hi user2"); // this will be send 
// })
// app.use("/user",[(req,res,next)=>{
//     console.log("first route handler"); 
//     res.send("hi user");
//     next(); 
// },(req,res)=>{ 
//     console.log("second route handler");
//     res.send("hi user2"); 
// }]) // we can also pass all route handler in an array
// app.use("/user",[(req,res,next)=>{
//     console.log("first route handler"); 
//     res.send("hi user");
//     next(); 
// },(req,res,next)=>{ 
//     console.log("second route handler");
//     res.send("hi user2"); 
//     next();
// }],(req,res)=>{
//     console.log("second route handler");
//     res.send("hi user2"); 
// }) // we can also mis-match the pattern



/*
middlewares 
when we want to do some operations before routes then we use 
middlewares like auth operations.
route handlers are those who actually send data back to client
We can also create seperate folder for middlewares
*/  
// app.use("/admin",(req,res,next)=>{
//     console.log("request is authorized");
//     next();
// })
// // another method to pass middlewares
// const auth = (req,res,next)=>{
//     console.log("request is authorized");
//     next();
// }
// app.use("/admin/alluser",auth,(req,res)=>{
//     res.send("all users");
// })

// app.use("/example",(req,res,next)=>{
//     console.log("app.use was called");
//     next();
// })
// app.all("/example",(req,res,next)=>{
//     console.log("app.all was called");
//     next();
// })
// app.get("/example",(req,res)=>{
//     console.log("/example request is handled");
//     res.send("request is completed");
// })
// app.get("/example/user",(req,res)=>{
//     console.log("/user request is handled");
//     res.send("request is completed");
// })

// /*
// if there is a request for /example then 
// app.use was called
// app.all was called
// /example request is handled
// if there is a request for /example/user
// app.use was called
// /user request is handled

// this the difference between app.use and app.all that app.all is 
// called when it exactly matches the path and app.use is called when
// the prefix is matched
// */

/*
app.use matches for prefix and which ever is the first to match
the prefix that route is called but if we use app.get  or app.post,etc and app.all
they will be called only if the path is matched completely.
*/

/*
Wild card error handling 
If an error occurs then if don't handle it there it can 
send that error message to frontend and our important info.
will be expose.
*/
app.use("/user",(req,res)=>{
    throw new Error("some error");
    res.send("data successfully send");
})
app.use("/",(err,req,res,next)=>{
    // they are special error handler that are called by express
    // implicitly and while processing a request if there is some error
    // then which ever error handler matches first to the given request path that error handler is called
    // these are special error handler i.e (err,req,res,next) they are not called for normal
    // requests even if the path matches
    // NOTE : it should be always written below all route handlers
    if(err)
    {
        res.status(500).send("internal server error");
    }
    else{
        res.status(404).send("route not found");
    }
})
/*
Passing variables in callback of route handlers
no of variable === role
2 === req,res
3 === req,res,next
4 === err,req,res,next

if you put something like this
(err,req,res)=>{}
then err will work as req and req as res and res as next
*/
app.listen(7777,()=>{
    console.log("server running on port:",7777);
});