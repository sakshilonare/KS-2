import React, { useState } from "react";

const AudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [processedResponse, setProcessedResponse] = useState("");

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
      const response = await fetch("http://localhost:3000/api/chatbot/upload-audio", {
        method: "POST",
        body: formData,
      });

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
    <div>
      <button onClick={startRecording}>Start Recording</button>
      {audioURL && <audio controls src={audioURL}></audio>}
      <button onClick={uploadAudio} disabled={!audioBlob}>
        Upload Audio
      </button>
      {processedResponse && (
        <div>
          <h3>Processed Audio Response:</h3>
          <p>{processedResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
