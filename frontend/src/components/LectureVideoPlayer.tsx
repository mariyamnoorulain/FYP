import { useState, useEffect, useRef } from 'react';
import { X, Activity, RotateCcw } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import MicroQuizModal from './MicroQuizModal';

interface LectureVideoPlayerProps {
    lectureId: string;
    videoUrl: string;
    onClose: () => void;
    isCompleted?: boolean;
}

export default function LectureVideoPlayer({ lectureId, videoUrl, onClose, isCompleted = false }: LectureVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(!isCompleted);
    const [showAnalytics, setShowAnalytics] = useState(isCompleted);
    const [generatingAnalytics, setGeneratingAnalytics] = useState(false);
    const [liveEmotion, setLiveEmotion] = useState<string | null>(null);
    const [liveAttention, setLiveAttention] = useState<boolean>(true);
    const [maxTimeReached, setMaxTimeReached] = useState(0);
    const [lectureData, setLectureData] = useState<any>(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizMode, setQuizMode] = useState<'single' | 'full'>('single');
    const [distractionQuizIndex, setDistractionQuizIndex] = useState(0);
    const [showDistractionWarning, setShowDistractionWarning] = useState(false);

    const distractionTimer = useRef<number>(0);

    const getBadgeText = () => {
        if (liveEmotion === 'Camera Unavailable') return 'Camera Unavailable';
        if (!liveAttention) return 'Analyzing (Not Attentive)';
        return `Analyzing ${liveEmotion ? `(${liveEmotion})` : ''}`;
    };
    const videoRef = useRef<HTMLVideoElement>(null);
    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize WebCam
    useEffect(() => {
        let stream: MediaStream | null = null;

        const startWebcam = async () => {
            try {
                // Removed explicit session clearance to preserve logs across refresh/rewind boundaries
                // The analytics generate sequentially and continuously.

                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (webcamVideoRef.current) {
                    webcamVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied or unavailable", err);
            }
        };

        if (!showAnalytics && !stream) {
            startWebcam();
        }

        return () => {
            // Cleanup webcam stream when component unmounts or analytics show
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [showAnalytics]);


    // Capture frame and send to analysis every 3 seconds
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && !showAnalytics) {
            interval = setInterval(async () => {
                try {
                    const webcam = webcamVideoRef.current;
                    const canvas = canvasRef.current;

                    if (!webcam || !canvas) return;

                    // Only capture if video is playing and ready
                    if (webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
                        canvas.width = webcam.videoWidth;
                        canvas.height = webcam.videoHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
                            const image_base64 = canvas.toDataURL('image/jpeg');

                            // Compute current timestamp
                            const currentTimestamp = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
                            const token = sessionStorage.getItem('token');

                            const response = await fetch('http://localhost:5000/api/engagement/analyze-frame', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    lectureId: lectureId,
                                    timestamp: currentTimestamp,
                                    image_base64: image_base64
                                })
                            });

                            if (response.ok) {
                                const data = await response.json();
                                setLiveEmotion(data.emotion);
                                setLiveAttention(data.attention);

                                // Distraction Logic: 3 seconds of inattention triggers a warning and quiz
                                if (!data.attention) {
                                    distractionTimer.current += 1;
                                    console.log(`[Attention Check] Consecutive inattention: ${distractionTimer.current}s`);

                                    if (distractionTimer.current === 3) {
                                        setShowDistractionWarning(true);
                                        setIsPlaying(false);
                                        if (videoRef.current) videoRef.current.pause();

                                        // Trigger quiz robustly
                                        checkForQuizAndShow('single');
                                    }
                                } else {
                                    distractionTimer.current = 0;
                                    setShowDistractionWarning(false);
                                }

                                console.log(`[Emotion Attention Module] Logged at ${currentTimestamp}s: Emotion: ${data.emotion}, Attention: ${data.attention}`);
                            }
                        }
                    } else {
                        // Camera stream is inactive or blocked, silently log inattention
                        const currentTimestamp = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
                        const token = sessionStorage.getItem('token');
                        const response = await fetch('http://localhost:5000/api/engagement/log', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                lectureId: lectureId,
                                timestamp: currentTimestamp,
                                emotion: 'neutral',
                                attention: false
                            })
                        });
                        if (response.ok) {
                            setLiveEmotion('Camera Unavailable');
                            setLiveAttention(false);

                            // Trigger distraction logic for camera failure too
                            distractionTimer.current += 1;
                            if (distractionTimer.current === 3) {
                                setShowDistractionWarning(true);
                                setIsPlaying(false);
                                if (videoRef.current) videoRef.current.pause();
                                checkForQuizAndShow('single');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to log engagement', error);
                }
            }, 1000); // Poll every 1 second for real-time feel
        }

        return () => {
            clearInterval(interval);
            distractionTimer.current = 0;
        };
    }, [isPlaying, lectureId, showAnalytics, lectureData]);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/lectures/${lectureId}`);
                if (response.ok) {
                    const data = await response.json();
                    setLectureData(data);
                    console.log(`[Quiz] Lecture quiz status: ${data.processingStatus}`, data.quiz ? 'Data Present' : 'Missing');
                }
            } catch (err) {
                console.error('Error fetching lecture data:', err);
            }
        };
        fetchLecture();
    }, [lectureId]);

    // Helper: check quiz has at least one question with options
    const isValidQuiz = (quiz: any): boolean => {
        if (!quiz) return false;
        const questions = quiz.mcqs || quiz.questions || [];
        return Array.isArray(questions) && questions.length > 0 && questions[0]?.options?.length > 0;
    };

    // Extra check: If we hit distraction but quiz is missing, try one last fetch
    const checkForQuizAndShow = async (mode: 'single' | 'full' = 'single') => {
        setQuizMode(mode);

        // Already have a valid quiz in state
        if (isValidQuiz(lectureData?.quiz)) {
            setShowQuiz(true);
            return;
        }

        // Attempt one emergency re-fetch from DB
        console.log('[Quiz] Quiz missing or invalid in state, attempting emergency fetch...');
        try {
            const response = await fetch(`http://localhost:5000/api/lectures/${lectureId}`);
            if (response.ok) {
                const data = await response.json();
                setLectureData(data);
                if (isValidQuiz(data.quiz)) {
                    setShowQuiz(true);
                    return;
                }
            }
        } catch (e) {
            console.error('Emergency fetch failed', e);
        }

        // No valid quiz found — resume video immediately instead of hanging
        console.warn('[Quiz] No valid quiz available. Resuming video.');
        setShowDistractionWarning(false);
        distractionTimer.current = 0;
        if (mode === 'full') {
            // End of video with no quiz — just trigger analytics
            triggerAnalyticsGeneration();
        } else {
            // Mid-video distraction check with no quiz — just resume
            if (videoRef.current) {
                videoRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        }
    };

    const markLectureComplete = async (quizScore: number = 100) => {
        try {
            const token = sessionStorage.getItem('token');
            const analyticsResponse = await fetch('http://localhost:5000/api/engagement/generate-analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lectureId,
                    currentProgress: videoRef.current ? Math.floor(videoRef.current.currentTime) : 0
                })
            });

            const analytics = analyticsResponse.ok ? await analyticsResponse.json() : null;
            console.log(`[Progress] Marking lecture ${lectureId} as complete with score ${quizScore}...`);
            await fetch('http://localhost:5000/api/engagement/mark-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lectureId,
                    quizScore,
                    attentionScore: analytics?.attentionScore ?? (liveAttention ? 100 : 50),
                    analytics
                })
            });
            setShowAnalytics(true);
        } catch (e) {
            console.error('Error marking lecture complete', e);
        }
    };

    const triggerAnalyticsGeneration = async () => {
        setGeneratingAnalytics(true);
        try {
            const token = sessionStorage.getItem('token');
            const currentProgress = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
            console.log(`[Analytics Trigger] Generating at: ${currentProgress}s. Sending to backend...`);
            await fetch('http://localhost:5000/api/engagement/generate-analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    lectureId,
                    currentProgress
                })
            });
            setShowAnalytics(true);
        } catch (e) {
            console.error('Error generating analytics', e);
        } finally {
            setGeneratingAnalytics(false);
        }
    };

    const handleVideoPause = () => {
        setIsPlaying(false);
        // Show live analytics snapshot whenever the student pauses
        // Only trigger if not already showing a quiz, and video has at least 3 seconds of data
        if (!showQuiz && videoRef.current && videoRef.current.currentTime > 3) {
            triggerAnalyticsGeneration();
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
        checkForQuizAndShow('full').then(() => {
            // If quiz was not ready/present, fall back to analytics
            if (!lectureData?.quiz && !showQuiz) {
                triggerAnalyticsGeneration();
            }
        });
    };

    const handleVideoPlay = () => {
        setIsPlaying(true);
        setShowAnalytics(false);  // Hide analytics panel when student resumes watching
    };

    const handleRetakeLecture = async () => {
        if (!window.confirm("Retake this lecture from the start? Your saved completion record and analytics will remain until a new attempt updates them.")) {
            return;
        }

        try {
            setMaxTimeReached(0);
            localStorage.removeItem(`progress_${lectureId}`);
            setLiveEmotion(null);
            setLiveAttention(true);
            setShowAnalytics(false);

            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Failed to retake lecture:", error);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            localStorage.setItem(`progress_${lectureId}`, currentTime.toString());

            // Update max time reached to prevent forwarding
            if (currentTime > maxTimeReached) {
                setMaxTimeReached(currentTime);
            }
        }
    };

    const handleSeeking = () => {
        if (videoRef.current) {
            // If the user tries to seek ahead of what they've already watched
            // We ignore this check if maxTimeReached is 0 during the initial restore window
            if (maxTimeReached > 0 && videoRef.current.currentTime > maxTimeReached + 1) {
                videoRef.current.currentTime = maxTimeReached;
            }
        }
    };

    const handleLoadedMetadata = () => {
        const savedTime = localStorage.getItem(`progress_${lectureId}`);
        if (savedTime && videoRef.current) {
            const time = parseFloat(savedTime);
            // Don't seek if we were finished
            if (time > 0 && time < videoRef.current.duration - 1) {
                // IMPORTANT: Set maxTimeReached FIRST to avoid handleSeeking snapping it back to 0
                setMaxTimeReached(time);
                videoRef.current.currentTime = time;
                console.log(`[Resume Logic] Restored playback to: ${time}s`);
            }
        }
    };

    const jumpBack = (seconds: number) => {
        if (videoRef.current) {
            const newTime = Math.max(0, videoRef.current.currentTime - seconds);
            videoRef.current.currentTime = newTime;
            // No need to update maxTimeReached since seeking back is always allowed
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
            {/* Global Fixed Distraction Toast */}
            {showDistractionWarning && (
                <div className="fixed top-8 left-8 z-[100] animate-bounce">
                    <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-[3px] border-red-400 backdrop-blur-md min-w-[300px]">
                        <div className="bg-white/20 p-3 rounded-xl border border-white/30">
                            <Activity className="w-8 h-8 animate-pulse text-white" />
                        </div>
                        <div className="flex flex-col">
                            <p className="font-extrabold text-lg tracking-wide uppercase shadow-sm">Attention Required!</p>
                            <p className="text-sm text-red-100 font-medium">You seem distracted. Please focus back on the lecture!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Full-page Quiz Overlay (outside video player box) ── */}
            {showQuiz && isValidQuiz(lectureData?.quiz) && (
                <MicroQuizModal
                    quiz={quizMode === 'single' 
                        ? (() => {
                            const qList = lectureData.quiz.mcqs || lectureData.quiz.questions || [];
                            return qList[distractionQuizIndex % Math.max(1, qList.length)];
                        })()
                        : lectureData.quiz}
                    mode={quizMode}
                    onSuccess={(score?: number) => {
                        setShowQuiz(false);
                        setShowDistractionWarning(false);
                        distractionTimer.current = 0;

                        if (quizMode === 'single') {
                            setDistractionQuizIndex(prev => prev + 1);
                        }

                        // Resume video automatically after quiz if single mode
                        if (quizMode === 'single' && videoRef.current) {
                            videoRef.current.play().catch(console.error);
                            setIsPlaying(true);
                        }

                        // If this was an end-of-video quiz, mark as completed and generate analytics
                        if (videoRef.current && Math.abs(videoRef.current.currentTime - videoRef.current.duration) < 2) {
                            markLectureComplete(score !== undefined ? score : 100);
                        }
                    }}
                />
            )}

            <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-auto relative">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {!showAnalytics ? 'Video Player & Emotion Detection Active' : 'Session Analytics'}
                        {!showAnalytics && isPlaying && (
                            <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full animate-pulse capitalize ${liveAttention ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <Activity className="w-3 h-3 mr-1" />
                                {getBadgeText()}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-4 md:p-6 flex-1 overflow-y-auto flex flex-col gap-4 relative">


                    <video ref={webcamVideoRef} autoPlay playsInline muted className="opacity-0 absolute w-[1px] h-[1px] pointer-events-none z-[-1]" />
                    <canvas ref={canvasRef} className="opacity-0 absolute w-[1px] h-[1px] pointer-events-none z-[-1]" />

                    <div className="relative group/video">
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full rounded-xl bg-black max-h-[60vh] shadow-lg"
                            controls
                            autoPlay={!isCompleted}
                            onPlay={handleVideoPlay}
                            onPause={handleVideoPause}
                            onTimeUpdate={handleTimeUpdate}
                            onSeeking={handleSeeking}
                            onEnded={handleVideoEnded}
                            onLoadedMetadata={handleLoadedMetadata}
                        />



                        {/* Custom Rewind Button Overlay */}
                        {!showAnalytics && (
                            <button
                                onClick={() => jumpBack(10)}
                                className="absolute bottom-[60px] right-[52px] p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all flex items-center justify-center backdrop-blur-sm border border-white/10 z-10"
                                title="Rewind 10s"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Show analytics immediately trailing below the active video logic */}
                    {showAnalytics && !isPlaying ? (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleRetakeLecture}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                                >
                                    <Activity className="w-4 h-4" />
                                    Retake Lecture
                                </button>
                            </div>
                            <AnalyticsDashboard lectureId={lectureId} />
                        </div>
                    ) : generatingAnalytics && !isPlaying ? (
                        <div className="h-48 flex flex-col items-center justify-center border-t mt-4 border-gray-100">
                            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-teal-700 font-semibold text-lg">Updating Analytics Cache...</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
