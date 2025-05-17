"use client";

import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";



type Message = {
  content: string;
  role: "user" | "assistant" | string;
};

export default function VoiceDiaryPage() {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setMessages([]);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [...prev, { content: message.transcript, role: message.role }]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      if (!user) {
        alert("Please log in to start your voice diary.");
        return;
      }
      try {
        setConnecting(true);
        setCallEnded(false);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!);
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen pt-24 pb-6 px-4 max-w-5xl mx-auto text-foreground">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold font-mono uppercase">
          Your <span className="text-primary">Daily Voice Diary</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Speak your thoughts and mood, and we’ll save your daily summary
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 flex flex-col items-center relative">
          <div
            className={`absolute inset-0 ${
              isSpeaking ? "opacity-30" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                    isSpeaking ? "animate-sound-wave" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          <div className="relative size-32 mb-4">
            <div
              className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                isSpeaking ? "animate-pulse" : ""
              }`}
            />
            <div className="relative w-32 h-32 rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
              <img src="https://th.bing.com/th/id/OIP.rg_rgaRvu7Phi_TTnA7ASwHaHa?cb=iwp2&rs=1&pid=ImgDetMain" alt="AI Assistant" className="w-full h-full object-cover" />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1">Voice Diary AI</h2>
          <p className="text-sm text-muted-foreground">Your mood & daily summary assistant</p>

          <div
            className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border ${
              isSpeaking ? "border-primary" : "border-border"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isSpeaking
                ? "Speaking..."
                : callActive
                ? "Listening..."
                : callEnded
                ? "Saving & redirecting..."
                : connecting
                ? "Connecting..."
                : "Ready to record"}
            </span>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 flex flex-col items-center relative">
          <div className="relative size-32 mb-4">
            <img
              src={user?.imageUrl || "/default-user.png"}
              alt="User"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">You</h2>
          <p className="text-sm text-muted-foreground">
            {user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Guest"}
          </p>

          <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
        </div>
      </section>

      <section
        ref={messageContainerRef}
        className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
      >
        {messages.length === 0 && (
          <p className="text-muted-foreground text-center mt-20">
            No diary entries yet. Click start and speak your day.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="mb-4">
            <div className="text-xs font-semibold text-muted-foreground mb-1">
              {msg.role === "assistant" ? "Voice Diary AI" : "You"}:
            </div>
            <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {callEnded && (
          <p className="text-primary font-semibold text-center mt-4 animate-fadeIn">
            Diary saved successfully, redirecting to your profile...
          </p>
        )}
      </section>

<div className="flex justify-center">
  <button
    onClick={toggleCall}
    disabled={connecting}
    className={`border-2 px-4 py-2 rounded-md font-bold text-lg transition-colors duration-300 
      ${callActive ? "border-red-500 text-red-600 hover:bg-red-50" 
                   : "border-blue-400 text-blue-500 hover:bg-blue-50"} 
      ${connecting ? "opacity-50 cursor-not-allowed" : ""}
    `}
  >
    {callActive ? "Stop Recording" : connecting ? "Connecting..." : "Start Recording"}
  </button>
</div>

    </main>
  );
}
