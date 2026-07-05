import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  startInterview,
  submitInterviewAnswer,
  finishInterview,
} from '../services/api';
import {
  Mic,
  MicOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Award,
  BookOpen,
  ThumbsUp,
  TrendingUp,
  Camera,
  CameraOff,
  Video,
  StopCircle,
  Download,
} from 'lucide-react';

const InterviewPage = () => {
  const navigate = useNavigate();

  // State management
  const [step, setStep] = useState<'setup' | 'active' | 'question_feedback' | 'overall_feedback'>('setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Setup form state
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Mid');
  const [questionCount, setQuestionCount] = useState(5);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Interview state
  const [interviewId, setInterviewId] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Individual evaluation results
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);

  // Overall results
  const [overallResult, setOverallResult] = useState<any>(null);

  // Camera & Screen Recording state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load latest resume data for setup recommendations
  useEffect(() => {
    const storedResume = localStorage.getItem('latestResume');
    if (storedResume) {
      try {
        const parsed = JSON.parse(storedResume);
        if (parsed.skills && parsed.skills.length > 0) {
          setSkills(parsed.skills.slice(0, 8));
        }
      } catch (err) {
        console.warn('Failed to parse latest resume skills', err);
      }
    } else {
      setSkills(['React', 'Node.js', 'TypeScript', 'SQL']);
    }

    // Cleanup tracks on page leave
    return () => {
      stopCamera();
      stopRecordingTracks();
    };
  }, [cameraStream]);

  // Skill tags management
  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Live Webcam controls
  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setError('Could not access camera feed. Please check permissions.');
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Screen & Microphone session recorder controls
  const startRecording = async () => {
    try {
      setError('');
      setRecordingUrl(null);
      setRecordedChunks([]);

      // 1. Capture screen video
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // 2. Capture microphone audio
      let audioStream: MediaStream | null = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (audioErr) {
        console.warn('Microphone access denied for recording, recording screen only.', audioErr);
      }

      // 3. Combine screen video & microphone audio
      const tracks = [...screenStream.getVideoTracks()];
      if (audioStream) {
        tracks.push(...audioStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // 4. Initialize MediaRecorder
      const options = { mimeType: 'video/webm; codecs=vp9' };
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(combinedStream, options);
      } catch (e) {
        recorder = new MediaRecorder(combinedStream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        setIsRecording(false);
        stopRecordingTracks();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // collect data chunks every second
      setIsRecording(true);
    } catch (err: any) {
      console.error(err);
      setError('Recording failed. Make sure you granted screen-sharing permission.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const stopRecordingTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Launch the interview session
  const handleStartInterview = async () => {
    setLoading(true);
    setError('');

    try {
      const storedResume = localStorage.getItem('latestResume');
      const parsedResume = storedResume ? JSON.parse(storedResume) : null;
      const resumeText = parsedResume?.extractedText || 'Experienced software engineer.';

      const response = await startInterview({
        role,
        skills,
        resumeText,
        difficulty,
        count: questionCount,
      });

      const { data } = response.data;
      setInterviewId(data._id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswer('');
      setStep('active');

      // Proactively try to start camera for interactive experience
      startCamera();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not initialize interview session.');
    } finally {
      setLoading(false);
    }
  };

  // Voice to text toggle
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setError('');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Voice recognition is not supported in this browser. Please try Chrome or Edge.');
        setIsListening(false);
        return;
      }

      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          const speechToText = event.results[0][0].transcript;
          setAnswer((prev) => (prev ? `${prev.trim()} ${speechToText}` : speechToText));
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error', event);
          setError('Microphone recording error. Please verify browser permissions.');
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error('Failed starting SpeechRecognition', err);
        setIsListening(false);
      }
    }
  };

  // Submit response for evaluation
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please type or dictate an answer before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    // Stop listening if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      const response = await submitInterviewAnswer(interviewId, {
        questionIndex: currentIndex,
        answer: answer.trim(),
      });

      const { evaluation } = response.data.data;
      setCurrentEvaluation(evaluation);
      setStep('question_feedback');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error occurred while saving your answer.');
    } finally {
      setLoading(false);
    }
  };

  // Go to next question or complete interview
  const handleProceed = async () => {
    if (currentIndex === questions.length - 1) {
      setLoading(true);
      setError('');
      try {
        stopCamera();
        stopRecording();
        const response = await finishInterview(interviewId);
        setOverallResult(response.data.data);
        setStep('overall_feedback');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Error compiling overall evaluation.');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
      setCurrentEvaluation(null);
      setStep('active');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 md:py-16 selection:bg-indigo-500 selection:text-white relative">
      <div className="aurora-bg"><div className="aurora-orb-pink" /></div>
      <div className="grid-pattern" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Navigation Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">AI Simulator Mode</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 1. SETUP STEP */}
        {step === 'setup' && (
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Configure Interview Session
              </h1>
              <p className="mt-2 text-slate-400">
                Customize target job fields, focus keywords, difficulty tier, and test size before starting.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" /> Target Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" /> Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Questions Count</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={7}>7 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-slate-300">Focus Skills / Keywords</label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Type a skill and press Enter"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3.5 py-1.5 text-xs text-slate-300 transition hover:bg-slate-750"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 font-bold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-4 font-semibold text-white shadow-lg shadow-indigo-900/25 transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Generating Questions using AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Begin Interview Session
                </>
              )}
            </button>
          </div>
        )}

        {/* 2. ACTIVE INTERVIEW STEP (Two-Column Layout) */}
        {step === 'active' && questions.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Questions and inputs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress indicators */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-indigo-400">Progress Tracker</span>
                  <span className="text-slate-400">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 backdrop-blur-xl shadow-xl">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Interviewer Question</span>
                <h2 className="mt-2 text-2xl font-bold leading-snug text-slate-100">
                  {questions[currentIndex]}
                </h2>
              </div>

              {/* Textarea answer input */}
              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/30 p-4 shadow-inner">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={8}
                  className="w-full bg-transparent p-2 text-slate-200 outline-none resize-none placeholder:text-slate-500 text-lg leading-relaxed"
                  placeholder="Type your response or click the microphone to dictate..."
                />
                <div className="mt-4 flex items-center justify-between border-t border-slate-850 pt-3">
                  <button
                    onClick={toggleListening}
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-900/20'
                        : 'bg-slate-850 text-slate-350 border border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4.5 w-4.5" /> Stop Dictating
                      </>
                    ) : (
                      <>
                        <Mic className="h-4.5 w-4.5 text-indigo-400" /> Start Dictation
                      </>
                    )}
                  </button>

                  {isListening && (
                    <span className="text-xs text-red-400 animate-pulse font-medium">Recording active... Speak now.</span>
                  )}

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !answer.trim()}
                    className="flex items-center gap-2 rounded-xl bg-indigo-650 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Evaluating...
                      </>
                    ) : (
                      <>
                        Submit Answer <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Media Proctored controls */}
            <div className="space-y-6">
              {/* Live webcam preview card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-indigo-400" /> Live Webcam Feed
                  </h3>
                  <button
                    onClick={toggleCamera}
                    className={`rounded-lg p-1.5 text-xs transition-all ${
                      isCameraOn
                        ? 'bg-red-950/40 text-red-400 border border-red-900/45'
                        : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/45'
                    }`}
                  >
                    {isCameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-cover transform -scale-x-100 ${!isCameraOn ? 'hidden' : ''}`}
                  />
                  {!isCameraOn && (
                    <div className="text-center p-4">
                      <CameraOff className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">Camera preview is off</p>
                      <button
                        onClick={startCamera}
                        className="mt-3 rounded-lg bg-indigo-950/30 border border-indigo-900/45 px-3 py-1.5 text-[10px] font-bold text-indigo-300"
                      >
                        Turn Camera On
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Screen Recorder */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Video className="h-4 w-4 text-indigo-400" /> Session Recorder
                  </h3>
                  {isRecording && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-500 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> REC
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Record your screen and microphone. You can download the full video report at the end.
                </p>

                <div className="flex gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 py-3 text-xs font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
                    >
                      <Video className="h-4 w-4" /> Record Session
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-3 text-xs font-bold text-red-400 hover:text-white transition hover:bg-slate-750"
                    >
                      <StopCircle className="h-4 w-4" /> Stop Recording
                    </button>
                  )}
                </div>

                {recordingUrl && (
                  <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/15 p-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Recording Saved!</span>
                    <a
                      href={recordingUrl}
                      download={`Interview-${role.replace(/\s+/g, '-')}.webm`}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-300 hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. QUESTION FEEDBACK STEP */}
        {step === 'question_feedback' && currentEvaluation && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Response Evaluation</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-100">Question {currentIndex + 1} Feedback</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 border-2 border-indigo-500 font-bold text-lg text-indigo-400">
                    {currentEvaluation.score}/10
                  </div>
                  <span className="text-sm text-slate-400">Question Score</span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-300 text-sm tracking-wider uppercase">Your Answer</h3>
                  <p className="mt-2 text-slate-400 italic bg-slate-850/30 p-4 rounded-xl border border-slate-800">
                    "{answer}"
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-300 text-sm tracking-wider uppercase">AI Review</h3>
                  <p className="mt-2 text-slate-350 leading-relaxed">
                    {currentEvaluation.feedback}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-950/20 bg-emerald-950/5 p-5">
                    <h4 className="font-semibold text-emerald-400 text-sm uppercase tracking-wide flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" /> Key Strengths
                    </h4>
                    <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                      {currentEvaluation.strengths?.map((str: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-red-950/20 bg-red-950/5 p-5">
                    <h4 className="font-semibold text-red-400 text-sm uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Improvement Areas
                    </h4>
                    <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                      {currentEvaluation.weaknesses?.map((weak: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Compiling Results...
                  </>
                ) : (
                  <>
                    {currentIndex === questions.length - 1 ? 'Finish & Generate Report' : 'Proceed to Next Question'}
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 4. OVERALL RESULTS REPORT */}
        {step === 'overall_feedback' && overallResult && (
          <div className="space-y-8">
            {recordingUrl && (
              <div className="rounded-3xl border border-emerald-900/40 bg-emerald-950/25 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2 text-base">
                    <Video className="h-5 w-5 text-emerald-400" /> Recorded Session Download Available
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Download the complete recording of your screen capture and microphone audio.
                  </p>
                </div>
                <a
                  href={recordingUrl}
                  download={`AI-Interview-${overallResult.role.replace(/\s+/g, '-')}-Session.webm`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Download className="h-5 w-5" /> Download Recording File
                </a>
              </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-slate-800">
                <Award className="h-16 w-16 text-indigo-400 mb-4 animate-bounce" />
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Interview Report Card
                </h1>
                <p className="mt-1.5 text-slate-400 text-base max-w-lg">
                  Performance audit for the {overallResult.difficulty}-level {overallResult.role} simulator.
                </p>

                <div className="mt-8 relative flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border-4 border-slate-800 border-t-indigo-500 border-r-indigo-500 animate-spin absolute" />
                  <div className="h-24 w-24 rounded-full bg-slate-950 border border-slate-850 flex flex-col items-center justify-center z-10">
                    <span className="text-3xl font-extrabold text-white">{overallResult.overallScore}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Score / 10</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-200 text-base tracking-wide flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-400" /> Overall Assessment Feedback
                  </h3>
                  <p className="mt-3 text-slate-350 leading-relaxed text-base bg-slate-850/20 p-5 rounded-2xl border border-slate-850">
                    {overallResult.overallFeedback}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-250 text-base tracking-wide mt-8">Question History & Answers</h3>
                  <div className="space-y-4">
                    {overallResult.questions.map((q: string, idx: number) => {
                      const evalObj = overallResult.evaluations.find((e: any) => e.questionIndex === idx) || {};
                      return (
                        <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-3">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-850 pb-2">
                            <span className="font-bold text-indigo-400 text-sm">Question {idx + 1}</span>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-indigo-350">
                              Score: {evalObj.score}/10
                            </span>
                          </div>
                          <p className="text-slate-200 font-semibold text-sm">{q}</p>
                          <p className="text-slate-400 text-sm italic">
                            "{(overallResult.answers && overallResult.answers[idx]) || 'No answer provided'}"
                          </p>
                          <p className="text-slate-350 text-sm mt-1">{evalObj.feedback}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 font-bold text-white transition hover:brightness-110"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
