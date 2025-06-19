import React, { useEffect, useState, useRef } from "react";
import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { extractDigits, formatPhoneNumber } from "../utils/phoneCleaner";
import "./VoiceAssistant.css";

const Message = ({ type, text }) => (
  <div className="message">
    <strong className={`message-${type}`}> {type === "agent" ? "CAVA:" : "You:"} </strong>
    <span className="message-text">{text}</span>
  </div>
);

export default function VoiceAssistant() {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription(
    {
      publication: localParticipant.microphoneTrack,
      source: Track.Source.Microphone,
      participant: localParticipant.localParticipant,
    }
  );

  const [messages, setMessages] = useState([]);
  const [phone, setPhone] = useState("");
  const endRef = useRef(null);

  // Merge and sort transcripts into messages
  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  // Extract phone digits from user speech
  useEffect(() => {
    const combined = (userTranscriptions || [])
      .map(seg => seg.text.trim())
      .join(" ");
    const digits = extractDigits(combined);
    setPhone(digits);

    if (digits.length === 10) {
      const formatted = formatPhoneNumber(digits);
      console.log("📞 Full number:", formatted);
      // TODO: trigger lookup_customer tool or callback here
    }
  }, [userTranscriptions]);

  // Auto-scroll conversation
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="voice-assistant-container">
      <div className="visualizer-container">
        <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
      </div>
      <div className="control-section">
        <VoiceAssistantControlBar />

        

        {/* Scrollable conversation */}
        <div className="conversation">
          {messages.map((msg, idx) => (
            <Message key={msg.id || idx} type={msg.type} text={msg.text} />
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
