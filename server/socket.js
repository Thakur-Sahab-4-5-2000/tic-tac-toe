import {
  findAvailableRoom,
  createNewRoom,
  joinRoom,
  winnerofTheGame,
  resetGame,
} from "./utils/roomRelatedFunctions.js";
import { getRoomsFromRedis, saveRoomsToRedis } from "./config/ioredis.js";

const socketSetup = (io) => {
  io.use(async (socket, next) => {
    const room = socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", async (socket) => {
    console.log("A user connected", socket.id);

    let roomObject = await getRoomsFromRedis();

    let roomAvailable = findAvailableRoom(socket.room, roomObject);

    if (!roomAvailable) {
      roomAvailable = createNewRoom(roomObject);
      await saveRoomsToRedis(roomObject);
      console.log("Room created:", roomAvailable);
    }
    joinRoom(socket, roomAvailable, roomObject);
    io.to(socket.room).emit(
      "statusMessage",
      `Player with ${socket.id} has joined the room ${socket.room}`
    );

    if (roomObject[roomAvailable].players.length === 2) {
      const [player1, player2] = roomObject[roomAvailable].players;
      io.to(player1).emit(
        "playerAssigned",
        `Player 2 with ${player2} has connected successfully`
      );
      io.to(player2).emit(
        "playerAssigned",
        `Player 1 with ${player1} has connected successfully`
      );
      roomObject[roomAvailable].gameActive = true;
      io.to(roomAvailable).emit(
        "statusMessage",
        "Game started! Player X's turn."
      );
      io.to(roomAvailable).emit("updateBoard", {
        board: roomObject[roomAvailable].board,
        currentPlayer: "X",
      });
      await saveRoomsToRedis(roomObject);
    }

    socket.on("makeMove", async (data) => {
      const { room, index, symbol } = data;
      if (
        roomObject[room].gameActive &&
        roomObject[room].currentPlayer === symbol &&
        roomObject[room].board[index] === null
      ) {
        roomObject[room].board[index] = symbol;
        roomObject[room].currentPlayer =
          roomObject[room].currentPlayer === "X" ? "O" : "X";

        io.to(room).emit("updateBoard", {
          board: roomObject[room].board,
          currentPlayer: roomObject[room].currentPlayer,
        });

        if (winnerofTheGame(roomObject[room].board)) {
          io.to(room).emit("gameOver", { winner: symbol });
          resetGame(room, roomObject);
          io.to(room).emit("statusMessage", "Game has been reset.");
        } else if (roomObject[room].board.every((cell) => cell != null)) {
          io.to(room).emit("gameOver", { winner: null });
          resetGame(room, roomObject);
          io.to(room).emit(
            "statusMessage",
            "Game has been reset due to a draw."
          );
        } else {
          io.to(room).emit(
            "statusMessage",
            `Player ${roomObject[room].currentPlayer}'s turn`
          );
        }
        await saveRoomsToRedis(roomObject);
      }
    });

    socket.on("disconnect", async () => {
      const roomObject = await getRoomsFromRedis();
      let roomKey = null;

      for (const [key, room] of Object.entries(roomObject)) {
        console.log("key", key);
        console.log("room", room);
        if (room.players.includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      console.log(`Player ${socket.id} disconnected from room ${roomKey}`);

      if (roomKey) {
        roomObject[roomKey].players = roomObject[roomKey].players.filter(
          (player) => player !== socket.id
        );

        if (roomObject[roomKey].players.length === 0) {
          delete roomObject[roomKey];
          console.log(`Room ${roomKey} deleted as no players are left.`);
        } else {
          console.log(`Player ${socket.id} removed from room ${roomKey}.`);
        }

        await saveRoomsToRedis(roomObject);
      }
    });
  });
};

export default socketSetup;
