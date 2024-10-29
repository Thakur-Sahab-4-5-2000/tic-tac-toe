import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

export const saveRoomsToRedis = async (roomObject) => {
  try {
    await redis.set("rooms", JSON.stringify(roomObject));
    console.log("Rooms saved to Redis successfully.");
  } catch (err) {
    console.error("Error saving rooms to Redis:", err);
  }
};

export const getRoomsFromRedis = async () => {
  try {
    const rooms = await redis.get("rooms");
    return rooms ? JSON.parse(rooms) : {};
  } catch (err) {
    console.error("Error retrieving rooms from Redis:", err);
    return {};
  }
};

export default redis;
