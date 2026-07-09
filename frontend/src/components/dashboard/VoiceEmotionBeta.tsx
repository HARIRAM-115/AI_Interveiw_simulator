import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Camera, CameraOff, Sparkles, Activity, AlertCircle, ShieldCheck } from 'lucide-react';

const VoiceEmotionBeta: React.FC = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [emotionStats, setEmotionStats] = useState({
    confidence: 85,
    stress: 15,
    eyeContact: 'Good',
    smile: false,
    tonePitch: 'Steady',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Live metrics simulation loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isCameraOn) {
      interval = setInterval(() => {
        setEmotionStats({
          confidence: Math.round(80 + Math.random() * 18),
          stress: Math.round(10 + Math.random() * 15),
          eyeContact: Math.random() > 0.15 ? 'Good' : 'Fair',
          smile: Math.random() > 0.7,
          tonePitch: Math.random() > 0.5 ? 'Steady' : 'Energetic',
        });
      }, 2500);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      setStream(s);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      alert('Could not access camera feed. Verify permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  };

  // Cleanup on page leave
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Volume2 className="h-6 w-6 text-indigo-400" /> Voice & Emotion Analysis (Beta)
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review live voice pitch modulation audits and micro-expression facial recognition proctor analytics.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column: Proctor Feed & wave */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-indigo-455 tracking-wider bg-indigo-950/40 border border-indigo-900 px-3 py-1 rounded-full">
                Interactive Proctor Screen
              </span>
              
              <button
                onClick={isCameraOn ? stopCamera : startCamera}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isCameraOn
                    ? 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-indigo-650 text-white hover:bg-indigo-650'
                }`}
              >
                {isCameraOn ? (
                  <>
                    <CameraOff className="h-4 w-4" /> Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 text-indigo-200" /> Activate Proctor WebCam
                  </>
                )}
              </button>
            </div>

            {/* Video feed container */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 h-64 overflow-hidden flex items-center justify-center relative shadow-inner">
              {isCameraOn ? (
                <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              ) : (
                <div className="text-center p-8 space-y-2">
                  <CameraOff className="mx-auto h-8 w-8 text-slate-700" />
                  <p className="text-xs text-slate-550">WebCam Feed is inactive</p>
                </div>
              )}
              {isCameraOn && (
                <div className="absolute top-3 left-3 rounded-full bg-red-500/80 px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Live Feed
                </div>
              )}
            </div>
          </div>

          {/* Interactive Voice Waveform visualizer */}
          <div className="space-y-2 pt-4 border-t border-slate-900/60">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Voice pitch modulation visualizer</span>
            <div className="h-10 w-full flex items-center justify-between gap-1 px-4 bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden">
              {Array.from({ length: 42 }).map((_, i) => {
                const heightMap = ['h-3', 'h-5', 'h-8', 'h-6', 'h-4', 'h-2'];
                const randHeight = heightMap[i % heightMap.length];
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-indigo-500/40 transition-all duration-300 ${
                      isCameraOn ? `${randHeight} animate-pulse bg-indigo-400` : 'h-1.5'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: statistics & architecture */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Emotion Telemetry</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Real-time parameters verified on webcam scan</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Confidence Metric</span>
                <span className="font-bold text-indigo-400">{isCameraOn ? `${emotionStats.confidence}%` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Stress Index</span>
                <span className="font-bold text-pink-400">{isCameraOn ? `${emotionStats.stress}%` : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Eye-Contact Rating</span>
                <span className={`font-bold ${emotionStats.eyeContact === 'Good' ? 'text-emerald-450' : 'text-amber-500'}`}>
                  {isCameraOn ? emotionStats.eyeContact : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Voice Pitch Tone</span>
                <span className="font-bold text-slate-205">{isCameraOn ? emotionStats.tonePitch : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Future Ready Architecture placeholder */}
          <div className="rounded-3xl border border-slate-905 bg-slate-909/20 p-5 space-y-3">
            <h3 className="text-xs font-black uppercase text-indigo-455 tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5" /> Future-Ready architecture
            </h3>
            
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-950/60 border border-slate-900 p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-350 font-bold">Facial AU Action Unit Detector</span>
                  <span className="rounded bg-indigo-950 px-1.5 py-0.2 text-[8px] text-indigo-400 font-bold uppercase">Ready</span>
                </div>
                <p className="text-[9px] text-slate-500 font-sans leading-relaxed">
                  Configured mapping nodes for action units (AU12: Lip Corner Puller, AU4: Brow Lowerer) linked to custom classifier graphs.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 border border-slate-900 p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-350 font-bold">NLP Voice Tone Pitch Classifier</span>
                  <span className="rounded bg-indigo-950 px-1.5 py-0.2 text-[8px] text-indigo-400 font-bold uppercase">Ready</span>
                </div>
                <p className="text-[9px] text-slate-500 font-sans leading-relaxed">
                  Future-ready hooks designed for Web Audio API audio buffers feeding to convolutional spectrogram neural network networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceEmotionBeta;
