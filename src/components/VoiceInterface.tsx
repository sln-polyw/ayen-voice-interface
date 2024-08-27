import React, { useState, useEffect } from 'react';
import { Analytics } from '../utils/Analytics';
import { PhoneIcon, PhoneXMarkIcon, MicrophoneIcon, NoSymbolIcon, HandRaisedIcon } from '@heroicons/react/24/solid';

const VoiceInterface: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAyenThinking, setIsAyenThinking] = useState(false);


  useEffect(() => {
    // Check if microphone permission is already granted
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  const startCall = async () => {
    if (!hasPermission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (err) {
        console.error('Failed to get microphone permission:', err);
        return;
      }
    }
    
    setIsCalling(true);
    Analytics.trackEvent('call_started');
  };

  const endCall = () => {
    setIsCalling(false);
    setIsMuted(false);
    setIsAyenThinking(false);
    Analytics.trackEvent('call_ended');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Analytics.trackEvent(isMuted ? 'unmuted' : 'muted');
  };

  const interruptAyen = () => {
    setIsAyenThinking(false);
    Analytics.trackEvent('ayen_interrupted');
  };

  // Simulate Ayen thinking (for demonstration purposes)
  useEffect(() => {
    if (isCalling) {
      const timer = setTimeout(() => {
        setIsAyenThinking(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCalling]);

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 font-sans">
          {!isCalling 
            ? "Ready to chat with Ayen?" 
            : isAyenThinking 
              ? "Ayen is thinking..." 
              : "Ayen is listening..."}
        </h1>
        {isCalling && (
          <div className="w-4 h-4 bg-white rounded-full animate-pulse mx-auto"></div>
        )}
      </div>
      <div className="fixed bottom-10 left-0 right-0 flex justify-center space-x-6">
        {!isCalling ? (
          <button
            onClick={startCall}
            className="p-4 bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors duration-200"
          >
            <PhoneIcon className="h-8 w-8 text-white" />
          </button>
        ) : (
          <>
            <button
              onClick={endCall}
              className="p-4 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors duration-200"
            >
              <PhoneXMarkIcon className="h-8 w-8 text-white" />
            </button>
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 ${
                isMuted ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
              }`}
            >
              {isMuted ? (
                <NoSymbolIcon className="h-8 w-8 text-white" />
              ) : (
                <MicrophoneIcon className="h-8 w-8 text-white" />
              )}
            </button>
            {isAyenThinking && (
              <button
                onClick={interruptAyen}
                className="p-4 bg-purple-500 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-colors duration-200"
              >
                <HandRaisedIcon className="h-8 w-8 text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;