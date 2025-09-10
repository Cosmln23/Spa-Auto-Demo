// Voice Booking Widget cu OpenAI Realtime API
// [source: README.md, secțiunea 10 "Componentă UI – VoiceBookingWidget.tsx"]

'use client';
import { useState, useRef } from 'react';

type Status = 'idle' | 'ready' | 'listening' | 'processing' | 'error';

export default function VoiceBookingWidget() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function startVoiceBooking() {
    try {
      setStatus('ready');
      setMessage('Solicită permisiunea pentru microfon...');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create WebRTC connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Add local audio track
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote audio
      pc.ontrack = (event) => {
        const audio = audioRef.current ?? (audioRef.current = new Audio());
        audio.srcObject = event.streams[0];
        audio.play().catch(() => {});
      };

      setMessage('Se conectează la agentul vocal...');

      // Get ephemeral token from our API
      const tokenResponse = await fetch('/api/realtime-token');
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Token request failed');
      }

      // Create data channel for communication with OpenAI
      const dataChannel = pc.createDataChannel('oai-events');

      dataChannel.onopen = () => {
        setStatus('listening');
        setMessage('🎤 Spune-mi cum pot să te ajut cu programarea...');

        // Send session configuration
        dataChannel.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              instructions:
                tokenData.instructions ||
                `Ești un asistent vocal pentru rezervări la spălătoria auto. Ajuți clienții să facă rezervări în română.`,
              voice: tokenData.voice || 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 200,
              },
            },
          })
        );
      };

      dataChannel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'session.created':
              console.log('OpenAI session created:', message.session.id);
              break;

            case 'conversation.item.created':
              if (
                message.item.type === 'message' &&
                message.item.role === 'assistant'
              ) {
                setMessage('🤖 Procesez răspunsul...');
              }
              break;

            case 'response.audio_transcript.done':
              setMessage(`🤖 ${message.transcript}`);
              break;

            case 'error':
              console.error('OpenAI error:', message.error);
              setStatus('error');
              setMessage(`Eroare: ${message.error.message}`);
              break;
          }
        } catch (error) {
          console.error('Error parsing OpenAI message:', error);
        }
      };

      // Create offer and set up WebRTC connection
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to OpenAI Realtime endpoint (hypothetical - actual endpoint may differ)
      const rtcResponse = await fetch(
        `https://api.openai.com/v1/realtime/sessions/${tokenData.session_id}/rtc`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenData.client_secret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offer: {
              type: offer.type,
              sdp: offer.sdp,
            },
          }),
        }
      );

      if (!rtcResponse.ok) {
        throw new Error('Failed to establish WebRTC connection with OpenAI');
      }

      const rtcData = await rtcResponse.json();

      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription(rtcData.answer));

      // Auto-timeout after 2 minutes
      setTimeout(() => {
        if (pcRef.current === pc) {
          stopVoiceBooking();
        }
      }, 120000); // 2 minute timeout
    } catch (error) {
      console.error('Voice booking error:', error);
      setStatus('error');
      setMessage(
        error instanceof Error
          ? `Eroare: ${error.message}`
          : 'Nu s-a putut inițializa agentul vocal'
      );
    }
  }

  function stopVoiceBooking() {
    setStatus('idle');
    setMessage('');

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'ready':
        return 'Se pregătește...';
      case 'listening':
        return 'Ascult...';
      case 'processing':
        return 'Procesez...';
      case 'error':
        return 'Încearcă din nou';
      default:
        return 'Activează agentul vocal';
    }
  };

  const getButtonClass = () => {
    const baseClass =
      'w-full px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 ';

    switch (status) {
      case 'listening':
        return (
          baseClass +
          'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse'
        );
      case 'error':
        return (
          baseClass + 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
        );
      case 'ready':
      case 'processing':
        return (
          baseClass +
          'bg-gradient-to-r from-cyan-500 to-blue-500 text-white opacity-75 cursor-not-allowed'
        );
      default:
        return (
          baseClass +
          'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white neon-border'
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Agent Vocal pentru Rezervări
        </h2>
        <p className="text-sm text-neutral-400">
          Spune-mi ce serviciu vrei și când, iar eu mă ocup de programare
        </p>
      </div>

      <button
        onClick={status === 'listening' ? stopVoiceBooking : startVoiceBooking}
        disabled={status === 'ready' || status === 'processing'}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>

      {message && (
        <div className="text-center">
          <p
            className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-neutral-300'}`}
          >
            {message}
          </p>
        </div>
      )}

      {status === 'listening' && (
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Agentul te ascultă...</span>
        </div>
      )}
    </div>
  );
}
