import express, { Response, Request } from 'express';
import http from 'http';
import { Server, Socket } from "socket.io";
import { PORT } from './config';
import { SocketHandlerModel } from './models/socketMsgHandler';

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const SocketHandler = new SocketHandlerModel(io)

io.on("connection", (socket: Socket) => {
  SocketHandler.welcome(socket)
})

//server health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  console.log("HealthCheck called")
  res.sendStatus(200)
})


//start server
server.listen(PORT, () => {
  console.log(`******* Server listening on port :${PORT}`);
});