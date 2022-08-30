require ("dotenv").config();
const express = require ("express");
const mongoose = require ("mongoose");
const cors = require ("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require("./SocketServer");
const { ExpressPeerServer } = require("peer")
const path = require('path')

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http) 

io.on('connection', socket => {
    // console.log(socket.id + 'connected')
    SocketServer(socket)
})

// Create peer server
// PeerServer({ port: 3001, path: '/'})
ExpressPeerServer(http, { path: '/' })

/* app.get("/", (request,response) =>{
    response.json({msg : "Hello"});
}) */
app.use("/api", require("./routes/authRouter"))
app.use("/api", require("./routes/userRouter"))
app.use("/api", require("./routes/postRouter"))
app.use("/api", require("./routes/commentRouter"))
app.use("/api", require("./routes/notifyRouter"))
app.use("/api",require("./routes/messageRouter"))



const URI = process.env.MongoDB_Url;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if (err) throw err;
    console.log("Database Connected");
})

const port = process.env.PORT || 8005;

http.listen(port, (err) =>{
    if(err) throw err;
    console.log("Server is running at port",port);
})