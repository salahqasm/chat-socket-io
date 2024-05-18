import express from 'express';
import http from 'http';
import { Server, Socket } from "socket.io";
import { PORT } from './config';
import { Request, Response, NextFunction } from 'express';
import { SocketEvents } from './interfaces/socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());


io.on("connection", (socket: Socket) => {
  
  socket.emit(SocketEvents.CONNECTION_STATUS, "Connected")

  socket.on(SocketEvents.MSG, (data: string) => {
    socket.emit(SocketEvents.MSG, data)
  })

})


//server health check endpoint
app.get("/health", async (req: Request, res) => {
  console.log("HealthCheck called")
  res.sendStatus(200)
})


//start server
server.listen(PORT, () => {
  console.log(`******* Server listening on port :${PORT}`);
});