import { Button, Divider, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend_url";
const Page = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [joinRoomId, setJoinRoomId] = useState(queryParams.get("roomId") || "");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [createRoom, setCreateRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!username) {
      message.error("Please enter a username");
      return;
    }
    if (!joinRoomId) {
      message.error("Please enter a room ID");
      return;
    }
    if (!joinRoomPassword.trim()) {
      message.error("Please enter a password");
      return;
    }
    if (username && joinRoomId) {
      localStorage.setItem("username", username);
      async function joinRoom() {
        try {
          setLoading(true);
          const res = await axios.post(
            `${backend_url}/api/rooms/join`,
            {
              username: username,
              roomId: joinRoomId,
              password: joinRoomPassword,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(res);
          if (res.status === 200) {
            Cookies.set("token", res.data.token, { expires: 1 });
            navigate(`/play/${joinRoomId}`);
          }
        } catch (err: any) {
          message.error(err.response.data.message);
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
      joinRoom();
    }
  };

  const handleCreateRoom = () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    if (username) {
      localStorage.setItem("username", username);
      async function createRoom() {
        try {
          setLoading(true);
          const res = await axios.post(
            `${backend_url}/api/rooms/create`,
            {
              roomId: roomId,
              username: username,
              password: password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(res);
          if (res.status === 201) {
            Cookies.set("token", res.data.token, { expires: 1 });
            navigate(`/play/${roomId}`);
          }
        } catch (err: any) {
          message.error(err.response.data.message);
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
      createRoom();
    }
  };

  return (
    <div className="landing-page min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-8">
        Welcome to Multiplayer Drawing Game
      </h1>
      <div className="mx-auto p-5 bg-amber-400 rounded-4xl">
        {/* Username Input */}
        <div className="mb-0.5">Username</div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 bg-white text-black border rounded-md mb-3 focus:outline-none"
        />

        {/* Join Room Section */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg mb-6">
          <div className="text-xl font-semibold mb-4">Join Room</div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Room ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              className="w-48 p-2 rounded-lg text-black border"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={joinRoomPassword}
              onChange={(e) => setJoinRoomPassword(e.target.value)}
              className="w-48 p-2 rounded-lg text-black border"
            />
            <button
              onClick={handleJoinRoom}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition duration-300 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading ..." : "Join Room"}
            </button>
          </div>
        </div>

        <Divider variant="dashed" style={{ borderColor: "black" }}>
          or
        </Divider>

        {!createRoom && (
          <div className="text-center">
            <Button
              type="primary"
              onClick={() => setCreateRoom(!createRoom)}
              className="mb-4"
            >
              Create Room
            </Button>
          </div>
        )}
        {/* Create Room Section */}
        {createRoom && (
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
            <div className="text-xl font-semibold mb-4">Create Room</div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-48 p-2 rounded-lg text-black border"
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-48 p-2 rounded-lg text-black border"
              />
              <button
                onClick={handleCreateRoom}
                className="hover:cursor-pointer px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300"
                disabled={loading}
              >
                {loading ? "Creating Room..." : "Create Room"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
