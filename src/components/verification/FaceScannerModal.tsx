"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle2, AlertTriangle, ShieldCheck, Eye, RefreshCw, KeyRound } from "lucide-react";

interface FaceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (method: "camera_simulated" | "alternative_passphrase") => void;
  userName: string;
}

export function FaceScannerModal({ isOpen, onClose, onVerified, userName }: FaceScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "alternative">("camera");
  const [cameraState, setCameraState] = useState<"idle" | "requesting" | "ready" | "scanning" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState<"align" | "blink" | "turn" | "done">("align");
  const [challengeProgress, setChallengeProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const challengeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup video stream on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCameraState("idle");
      setCurrentChallenge("align");
      setChallengeProgress(0);
      setErrorMessage("");
    }
  }, [isOpen]);

  function stopCamera() {
    challengeTimersRef.current.forEach(clearTimeout);
    challengeTimersRef.current = [];
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  const startCamera = async () => {
    setCameraState("requesting");
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraState("ready");
      runVerificationSequence();
    } catch (err: any) {
      console.warn("Camera access declined or unavailable:", err);
      setCameraState("error");
      setErrorMessage(
        "Camera stream not available or permission was denied. You may switch to the Accessible Demo Alternative below."
      );
    }
  };

  // Simulated browser-side challenge sequence (Blink & Face Alignment)
  const runVerificationSequence = () => {
    setCameraState("scanning");
    setCurrentChallenge("align");
    setChallengeProgress(20);

    challengeTimersRef.current.push(setTimeout(() => {
      setCurrentChallenge("blink");
      setChallengeProgress(55);

      challengeTimersRef.current.push(setTimeout(() => {
        setCurrentChallenge("turn");
        setChallengeProgress(85);

        challengeTimersRef.current.push(setTimeout(() => {
          setChallengeProgress(100);
          setCurrentChallenge("done");
          setCameraState("success");

          challengeTimersRef.current.push(setTimeout(() => {
            stopCamera();
            onVerified("camera_simulated");
          }, 1200));
        }, 1500));
      }, 1500));
    }, 1500));
  };

  const handleAlternativeVerify = () => {
    onVerified("alternative_passphrase");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0b101b] p-6 shadow-2xl shadow-blue-900/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              BIOVOTE Demo Verification
            </h3>
            <p className="text-xs text-slate-400">
              No identity or liveness check is performed. Account: <span className="text-cyan-300 font-mono">{userName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 my-4">
          <button
              onClick={() => setActiveTab("camera")}
            className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "camera"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-4 h-4" />
            Optional Camera Preview
          </button>
          <button
            onClick={() => {
              setActiveTab("alternative");
              stopCamera();
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "alternative"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Continue Without Camera
          </button>
        </div>

        {/* Optional camera preview; timed prompts are simulated. */}
        {activeTab === "camera" && (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {cameraState === "idle" && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-300 max-w-sm">
                    The camera is optional and only displays a live preview in your browser. BIOVOTE does not analyze, capture, or upload camera frames. The prompts below are simulated.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20"
                  >
                    Grant Consent & Open Camera
                  </button>
                </div>
              )}

              {cameraState === "requesting" && (
                <div className="flex flex-col items-center gap-2 text-cyan-400 text-xs font-medium">
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                  <span>Requesting local camera access...</span>
                </div>
              )}

              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  cameraState === "ready" || cameraState === "scanning" || cameraState === "success"
                    ? "block"
                    : "hidden"
                }`}
              />

              {/* Futuristic HUD Scanning Reticles */}
              {(cameraState === "ready" || cameraState === "scanning") && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  {/* Bounding Guide Oval */}
                  <div className="relative w-48 h-60 rounded-[50%] border-2 border-dashed border-cyan-400/60 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <div className="absolute top-2 w-4 h-0.5 bg-cyan-400"></div>
                    <div className="absolute bottom-2 w-4 h-0.5 bg-cyan-400"></div>
                    <div className="absolute left-2 h-4 w-0.5 bg-cyan-400"></div>
                    <div className="absolute right-2 h-4 w-0.5 bg-cyan-400"></div>
                  </div>

                  {/* Dynamic Instructions Overlay */}
                  <div className="absolute bottom-3 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 animate-bounce" />
                    <span>
                      {currentChallenge === "align" && "Challenge 1: Center your face in frame..."}
                      {currentChallenge === "blink" && "Challenge 2: Blink naturally..."}
                      {currentChallenge === "turn" && "Challenge 3: Nod or tilt head slightly..."}
                      {currentChallenge === "done" && "Demo prompts complete — no identity check performed"}
                    </span>
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {cameraState === "success" && (
                <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-75 duration-300" />
                  <h4 className="mt-3 text-base font-bold text-white">Camera Demo Complete</h4>
                  <p className="text-xs text-slate-300 mt-1">This did not verify identity or liveness.</p>
                </div>
              )}

              {/* Error Display */}
              {cameraState === "error" && (
                <div className="p-6 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300">{errorMessage}</p>
                  <button
                    onClick={() => setActiveTab("alternative")}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium"
                  >
                    Continue Without Camera
                  </button>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {(cameraState === "scanning" || cameraState === "success") && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Simulated Prompt Progress</span>
                  <span className="text-cyan-400">{challengeProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${challengeProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Camera notice:</strong> This is a live preview only. No frame analysis or face matching occurs, and camera imagery is not uploaded by this feature.
              </span>
            </div>
          </div>
        )}

        {/* Accessible non-camera demo path */}
        {activeTab === "alternative" && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-200">
              <p className="font-semibold mb-1">Accessible Non-Biometric Alternative</p>
              <p className="text-purple-300/80 leading-relaxed">
                You can continue without a camera. This advances the interface simulation only and does not verify your identity.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAlternativeVerify}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/20 transition-all"
            >
              Continue without camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
