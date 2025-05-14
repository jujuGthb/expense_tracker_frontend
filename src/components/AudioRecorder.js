import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPlayArrow, MdStop } from "react-icons/md";
import { Loader2 } from "lucide-react";

import { server } from "../remote/server";

const AudioRecorder = ({
  handleChange,
  name,
  setIsSubmitting,
  isSubmitting,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        console.log(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    //console.log(token)

    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");
      try {
        const response = await fetch(`${server}/api/transactions/upload`, {
          method: "POST",
          Authorization: `Bearer ${token}`,
          body: formData,
        });

        const result = await response.json();
        console.log("Upload successful:", result);
        handleChange({ target: { name: name, value: result.data } });

        //handleChange({ target: { name: name, value: result.data } });
        return result;
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      uploadAudio(audioBlob);
    }
  }, [audioBlob]);

  // if (isSubmitting) {
  //   return (
  //     <div className="w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  //   );
  // }

  return (
    <div className="w-full max-w-lg mx-auto my-8 p-4 mt-10 shadow-lg rounded-2xl bg-white">
      <div className="flex justify-center gap-4">
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button onClick={startRecording} disabled={isRecording}>
              <MdPlayArrow />
            </button>
          ) : (
            <button onClick={stopRecording} disabled={!isRecording}>
              <MdStop />
            </button>
          )}
        </div>
        {/*audioUrl && (
          <div className="flex flex-col gap-2">
            <audio controls src={audioUrl} className="w-full rounded-2xl" />
            <button onClick={uploadAudio}>
              <faUpload className="mr-2" /> Upload Audio
            </button>
          </div>
        )*/}
      </div>
    </div>
  );
};

export default AudioRecorder;
