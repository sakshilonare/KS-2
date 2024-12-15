import React, { useState } from "react";
import {
  ArrowForwardOutlined,
  MicNoneOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);  // To store conversation history
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [processedResponse, setProcessedResponse] = useState("");

  const sendMessage = async () => {
    if (!message) return alert("Message cannot be empty");

    console.log('Sending message:', message);  // Debug log

    // Add user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
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
        // If not a successful response, log the error
        console.error('Response error:', res.statusText);
        return alert('Failed to send message.');
      }

      const result = await res.json();
      console.log('Received response:', result);  // Debug log to inspect the server response

      // Add bot's response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: result.response || "No response from AI." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Failed to get response." },
      ]);
    }

    // Clear the input field after sending
    setMessage("");
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      setAudioURL(URL.createObjectURL(audioBlob));
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000); // Stop recording after 10 seconds
  };

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
        setProcessedResponse(result.response);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error uploading audio:", error.message);
    }
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
          <div key={index}>
            <div
              className={`flex items-end ${msg.sender === "user" ? "justify-end" : ""}`}
            >
              <div className="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 order-1 items-start">
                <div>
                  <span
                    className={`px-4 py-3 rounded-xl inline-block ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    {msg.text}
                  </span>
                </div>
              </div>
              <img
                src={msg.sender === "user" ? "https://i.pravatar.cc/100?img=7" : "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"}
                alt=""
                className="w-6 h-6 rounded-full order-2"
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
            placeholder="Say something..."
            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
          />
          <div className="absolute right-2 items-center inset-y-0 hidden sm:flex w-[10vw] justify-evenly">
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              <ArrowForwardOutlined fontSize="small" />
            </button>
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              <MicNoneOutlined fontSize="small" />
            </button>
            <button
              type="button"
              onClick={uploadAudio}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              <FileUploadOutlined fontSize="small" />
            </button>
          </div>
        </div>

        {/* Audio Section */}
        {audioURL && (
          <div className="mt-4">
            <h3>Recorded Audio:</h3>
            <audio controls src={audioURL}></audio>
          </div>
        )}

        {processedResponse && (
          <div className="mt-4">
            <h3>Processed Audio Response:</h3>
            <p>{processedResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
