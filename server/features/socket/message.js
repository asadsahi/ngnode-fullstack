const DB = require('../../db/models'),
  Message = DB.Message,
  Room = DB.Room;

export class MessageSocket {
  nsp;
  data;
  socket;

  constructor(io, room) {
    this.nsp = io.of('/messages/' + encodeURIComponent(this.room.id.toString()));
    this.nsp.on('connection', (socket) => {
      console.log('Client connected to room:', this.room.id);
      this.socket = socket;
      this.listen();
    });
  }

  // Add signal
  listen() {
    this.socket.on('disconnect', () => this.disconnect());
    this.socket.on('create', (message) => this.create(message));
    this.socket.on('list', (roomId) => this.list(roomId));
  }

  // Handle disconnect
  disconnect() {
    console.log('Client disconnected from room:', this.room.name);
  }

  // Create a message in a room
  create(params) {
    // params.room = this.room.name;
    console.log(Room)
    Message.create(params).then((message) => this.nsp.emit('item', message),
    ).catch((error) => console.error('Message sending failed', error));
  }

  // List all messages in a room
  list(roomId) {
    Message.findAll({
      where: {
        id: roomId
      }
    }).then((messages) => messages.map((message) => this.socket.emit(message)))
      .catch((error) => console.log('Getting message list failed', error));
  }
}
