import { useState, useRef } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Quiz {
    mcqs?: QuizQuestion[];
    questions?: QuizQuestion[]; // Legacy support
}

interface MicroQuizModalProps {
    quiz: Quiz | QuizQuestion; // Support both legacy single question and new array format
    onSuccess: (score?: number) => void;
    mode?: 'single' | 'full';
}

export default function MicroQuizModal({ quiz, onSuccess, mode = 'single' }: MicroQuizModalProps) {
    // Normalize quiz data: Convert single question object to array if needed
    const questions: QuizQuestion[] = (quiz as Quiz).mcqs
        ? (quiz as Quiz).mcqs!
        : (quiz as Quiz).questions
            ? (quiz as Quiz).questions!
            : [(quiz as QuizQuestion)];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showCorrection, setShowCorrection] = useState(false);
    const correctCountRef = useRef(0);

    const activeQuestion = mode === 'single' ? questions[0] : questions[currentQuestionIndex];

    if (!activeQuestion || !activeQuestion.options) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-end bg-transparent p-6 sm:p-8">
                <div className="bg-white rounded-2xl w-full max-w-[380px] p-6 text-center shadow-2xl flex flex-col items-center gap-3 border border-gray-100">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-gray-800">Quiz Initializing...</h3>
                        <p className="text-xs text-gray-500 mt-1">Please wait a moment while we load your learning check.</p>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = () => {
        if (selectedOption === activeQuestion.correctAnswer) {
            setIsCorrect(true);
            correctCountRef.current += 1;
            setTimeout(() => {
                handleNext();
            }, 1000);
        } else {
            setIsCorrect(false);
            setShowCorrection(true);
        }
    };

    const handleNext = () => {
        const nextIndex = currentQuestionIndex + 1;

        if (mode === 'single' || nextIndex >= questions.length) {
            const finalScore = mode === 'single' ? (correctCountRef.current > 0 ? 100 : 0) : Math.round((correctCountRef.current / questions.length) * 100);
            onSuccess(finalScore);
        } else {
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowCorrection(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-end bg-transparent p-6 sm:p-8">
            <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 border border-gray-100">
                {/* Header */}
                <div className={`${isCorrect === false ? 'bg-red-600' : 'bg-indigo-600'} p-3 px-4 flex items-center justify-between text-white transition-colors`}>
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 animate-pulse" />
                        <div>
                            <h3 className="font-bold text-sm">
                                {mode === 'full' ? `Lecture Exam (${currentQuestionIndex + 1}/${questions.length})` : 'AI Attention Check'}
                            </h3>
                            <p className="text-[10px] text-white/80">
                                {isCorrect === false ? 'Review correctly to proceed.' : 'Verify your learning to continue.'}
                            </p>
                        </div>
                    </div>
                    {mode === 'full' && (
                        <div className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
                            Progress: {Math.round(((currentQuestionIndex) / questions.length) * 100)}%
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <p className="text-gray-800 font-medium mb-4 text-sm leading-relaxed">
                        {activeQuestion.question}
                    </p>

                    <div className="space-y-2">
                        {activeQuestion.options.map((option, index) => {
                            const isCorrectAnswer = index === activeQuestion.correctAnswer;
                            const isSelected = selectedOption === index;

                            let buttonClass = 'border-gray-200 bg-gray-50 hover:bg-gray-100';
                            if (isSelected) {
                                if (isCorrect === true) buttonClass = 'border-green-600 bg-green-50 text-green-700';
                                else if (isCorrect === false) buttonClass = 'border-red-600 bg-red-50 text-red-700';
                                else buttonClass = 'border-indigo-600 bg-indigo-50 text-indigo-700';
                            } else if (showCorrection && isCorrectAnswer) {
                                buttonClass = 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600 ring-offset-1';
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={isCorrect !== null}
                                    onClick={() => {
                                        setSelectedOption(index);
                                        setIsCorrect(null);
                                    }}
                                    className={`w-full p-2.5 px-4 text-left rounded-xl border transition-all flex justify-between items-center ${buttonClass}`}
                                >
                                    <span className="font-medium text-xs text-gray-700">{option}</span>
                                    {isSelected && isCorrect === true && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />}
                                    {isSelected && isCorrect === false && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 ml-2" />}
                                    {showCorrection && isCorrectAnswer && !isSelected && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />}
                                </button>
                            );
                        })}
                    </div>

                    {isCorrect === false && (
                        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-red-700 text-[11px] font-bold flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                Incorrect. Study the correct answer before moving on.
                            </p>
                        </div>
                    )}

                    {!showCorrection ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null || isCorrect === true}
                            className={`w-full mt-5 py-3 text-sm rounded-xl font-bold transition-all shadow ${selectedOption === null || isCorrect === true
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="w-full mt-5 py-3 text-sm bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow"
                        >
                            {mode === 'full' && currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & Continue'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
