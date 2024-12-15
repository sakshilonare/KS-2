import React, { useState, useEffect, useRef } from "react";
import {
  ArrowForwardOutlined,
  MicNoneOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const scrollRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start recording audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
    setRecording(true);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlob(audioBlob);

      // Add recorded audio to messages
      const audioURL = URL.createObjectURL(audioBlob);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", type: "audio", audioURL },
      ]);
      setRecording(false);
    };

    mediaRecorder.start();

    // Stop recording after 10 seconds
    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000);
  };

  // Upload audio to the server
  const uploadAudio = async () => {
    if (!audioBlob) return alert("No audio to upload!");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch(
        "http://localhost:3000/api/chatbot/upload-audio",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        // Add the bot's response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", type: "text", text: result.response },
        ]);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error uploading audio:", error.message);
    }
  };

  // Send text message to the server
  const sendMessage = async () => {
    if (!message) return alert("Message cannot be empty");

    // Add user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", type: "text", text: message },
    ]);

    try {
      const res = await fetch("http://localhost:3000/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        console.error("Response error:", res.statusText);
        return alert("Failed to send message.");
      }

      const result = await res.json();

      // Add bot's response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", type: "text", text: result.response || "No response from AI." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", type: "text", text: "Failed to get response." },
      ]);
    }

    setMessage(""); // Clear the input field after sending
  };

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen bg-white">
      {/* Messages Section */}
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {/* Map through the messages and display them */}
        {messages.map((msg, index) => (
          <div key={index} ref={scrollRef}>
            <div
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-1 items-start">
                <div>
                  {msg.type === "text" ? (
                    <span
                      className={`px-4 py-3 rounded-xl inline-block ${
                        msg.sender === "user"
                          ? "bg-lime-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {msg.text}
                    </span>
                  ) : (
                    <span
                      className={`px-4 py-3 rounded-xl inline-block ${
                        msg.sender === "user"
                          ? "bg-lime-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <audio controls src={msg.audioURL}></audio>
                    </span>
                  )}
                </div>
              </div>
              <img
                src={
                  msg.sender === "user"
                    ? "https://i.pravatar.cc/100?img=7"
                    : "bot.png"
                }
                alt=""
                className="w-10 h-10 rounded-full order-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Say something..."
            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
          />
          <div className="absolute right-2 items-center inset-y-0 hidden sm:flex w-[10vw] justify-evenly">
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-lime-500 hover:bg-lime-600 focus:outline-none"
            >
              <ArrowForwardOutlined fontSize="small" />
            </button>
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-lime-500 hover:bg-lime-600 focus:outline-none"
              disabled={recording}
            >
              <MicNoneOutlined fontSize="small" />
            </button>
            <button
              type="button"
              onClick={uploadAudio}
              disabled={!audioBlob}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-lime-500 hover:bg-lime-600 focus:outline-none"
            >
              <FileUploadOutlined fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
