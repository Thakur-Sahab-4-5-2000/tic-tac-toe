import { v4 as uuid } from "uuid";
import { saveRoomsToRedis } from "../config/ioredis.js";

const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const findAvailableRoom = (room, roomObject) => {
  console.log("Checking room: ", room);
  console.log("Current room object: ", roomObject);
  if (roomObject[room] && roomObject[room].players.length < 2) {
    console.log("Room found: ", room);
    return room;
  }

  const availableRoom = Object.keys(roomObject).find(
    (roomId) => roomObject[roomId].players.length === 1
  );

  console.log("Available room: ", availableRoom);

  return availableRoom || null;
};

export const createNewRoom = (roomObject) => {
  const roomId = uuid();
  roomObject[roomId] = {
    players: [],
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameActive: false,
  };
  console.log("Room created successfully");
  return roomId;
};

export const joinRoom = (socket, room, roomObject) => {
  console.log("-----Room joining-----");
  socket.join(room);
  roomObject[room].players.push(socket.id);
  saveRoomsToRedis(roomObject);
  console.log(
    "-----Room Joined------",
    roomObject[room],
    "------player joined-----",
    socket.id
  );
};

export const winnerofTheGame = (board) => {
  return winningCombination.some((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
};

export const resetGame = (roomId, roomObject) => {
  const newBoard = Array(9).fill(null);
  roomObject[roomId].board = newBoard;
  roomObject[roomId].currentPlayer = "X";
  roomObject[roomId].gameActive = false;
};
