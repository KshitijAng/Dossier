"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton, Tooltip, keyframes } from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicIcon from "@mui/icons-material/Mic";

// Uses the browser's built-in Web Speech API — no extra dependency. Toggle on
// to dictate, toggle off to stop. Renders nothing on unsupported browsers.
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.5); }
  50% { box-shadow: 0 0 0 6px rgba(211,47,47,0); }
`;

export default function MicButton({
  onText,
  disabled,
}: {
  onText: (text: string) => void;
  disabled?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript;
      }
      onText(text.trim());
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => rec.stop();
  }, [onText]);

  if (!supported) return null;

  const toggle = () => {
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      recRef.current.start();
      setListening(true);
    }
  };

  return (
    <Tooltip title={listening ? "Stop dictation" : "Speak your question"}>
      <span>
        <IconButton
          onClick={toggle}
          disabled={disabled}
          sx={{
            width: 40,
            height: 40,
            color: listening ? "error.main" : "text.secondary",
            animation: listening ? `${pulse} 1.4s infinite` : "none",
          }}
        >
          {listening ? <MicIcon /> : <MicNoneIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
