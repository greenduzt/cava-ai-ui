import { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import VoiceAssistant from "./VoiceAssistant";

const LiveKitModal = ({ setShowSupport }) => {
  const [isSubmittingName, setIsSubmittingName] = useState(true);
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  
  
  //const API = import.meta.env.VITE_API_BASE_URL
  //const LIVEKIT = import.meta.env.VITE_LIVEKIT_URL
    // Hard-coded endpoints for production
  const API     = "https://cavaai-api.azurewebsites.net"
  const LIVEKIT = "wss://cavaagent-8ar4xmei.livekit.cloud"


  const getToken = useCallback(async (userName) => {
  try {   
    
    const response = await fetch(`${API}/getToken?name=${encodeURIComponent(userName)}`)

    const token = await response.text();
    setToken(token);
    setIsSubmittingName(false);
    } catch (error) {
     console.error(error);
    }
    }, []);

    const handleNameSubmit = (e) => {
    e.preventDefault();
        if (name.trim()) {
            getToken(name);
        }
    };

  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="support-room">
                {isSubmittingName ? (
                    <form onSubmit={handleNameSubmit} className="name-form">
                        <h2>Enter your name to begin</h2>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                        />      
                        <button type="submit">Connect</button>   
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowSupport(false)}>
                        Cancel</button>               
                    </form>
                ) : token ? (
                  <LiveKitRoom
                    serverUrl={LIVEKIT}
                    token={token}
                    connect={true}
                    video={false}
                    audio={true}
                    onDisconnected={() => {
                        setShowSupport(false);
                        setIsSubmittingName(true);
                    }}
                  >
                    <RoomAudioRenderer />
                    <VoiceAssistant />
                  </LiveKitRoom>
                ) : null}
            </div>
        </div>
    </div>
  );
};

export default LiveKitModal;