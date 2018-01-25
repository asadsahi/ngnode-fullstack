const DB = require('../../db/models'),
  Room = DB.Room;

import { MessageSocket } from './message';

export class RoomSocket {
  nsp;
  name;
  data;
  socket;
  rooms = [];
  messageSockets = [];

  constructor(io) {
    this.nsp = this.io.of('/room');
    this.nsp.on('connection', (socket) => {
      console.log('Client connected');
      this.socket = socket;
      this.updateMessageSockets();
      this.listen();
    });
  }

  // Add signal
  listen() {
    this.socket.on('disconnect', () => this.disconnect());
    this.socket.on('create', name => this.create(name));
    this.socket.on('remove', id => this.remove(id));
    this.socket.on('list', () => this.list());
  }

  // Handle disconnect
  disconnect() {
    console.log('Client disconnected');
  }

  // Create a room
  create(name) {
    Room.create({
      name: name
    }).then(room => this.list())
      .catch(error => console.error('Room creation failed', error));
  }

  // Remove a room
  remove(id) {
    Room.destroy({
      where: {
        id: id
      }
    }).then((res) => this.list())
      .catch((error) => console.error('Room removal failed', error));
  }

  // List all rooms
  list() {
    Room.findAll().then((rooms) => {
      this.rooms = rooms;
      this.updateMessageSockets();
      this.nsp.emit('item', rooms);
    });
  }

  // Update message sockets
  updateMessageSockets() {
    // Add message sockets for new rooms
    const validRooms = {};
    for (const room of this.rooms) {
      validRooms[room.name] = true;
      const matches = this.messageSockets.filter(messageSocket => messageSocket.room.name === room.name);
      if (matches.length === 0) {
        console.log('creating new namespace for', room.name);
        this.messageSockets.push(new MessageSocket(this.io, room));
      }
    }

    // Destroy sockets for removed rooms
    // tslint:disable-next-line:forin
    for (const index in this.messageSockets) {
      const messageSocket = this.messageSockets[index];
      if (!validRooms[messageSocket.room.name]) {
        this.messageSockets.splice(parseInt(index, 10), 1);
      }
    }
  }
}
