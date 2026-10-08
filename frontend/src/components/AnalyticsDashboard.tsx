import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Activity, Focus, AlertCircle, Clock, Smile, Frown, Meh, Zap } from 'lucide-react';

interface AnalyticsData {
    analytics: {
        attentionScore: number;
        dominantEmotion: string;
        focusDrops: number;
        sessionDuration: number;
        emotionBreakdown: Record<string, number>;
    };
    timeline: {
        timestamp: number;
        emotion: string;
        attention: boolean;
    }[];
}

interface AnalyticsDashboardProps {
    lectureId: string;
    studentId?: string; // Optional if viewing as tutor
}

export default function AnalyticsDashboard({ lectureId, studentId }: AnalyticsDashboardProps) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const url = new URL(`http://localhost:5000/api/engagement/analytics/${lectureId}`);
                if (studentId) url.searchParams.append('studentId', studentId);

                const response = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) throw new Error('Analytics not generated yet');
                    throw new Error('Failed to load analytics');
                }

                const result = await response.json();
                if (!result.analytics) {
                    throw new Error('Analytics processing not finished yet');
                }
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [lectureId, studentId]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading Engagement Analytics...</div>;
    }

    if (error || !data) {
        return (
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                <Activity className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500">{error || "No analytics data available for this session yet."}</p>
                <p className="text-sm text-gray-400">Data will appear once the video playback completes.</p>
            </div>
        );
    }

    const { analytics, timeline } = data;

    // Render emotion icon
    const getEmotionIcon = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'happy': return <Smile className="w-8 h-8 text-green-500" />;
            case 'angry': return <Frown className="w-8 h-8 text-red-500" />;
            case 'disgust': return <Frown className="w-8 h-8 text-orange-500" />;
            case 'surprise': return <Zap className="w-8 h-8 text-blue-400" />;
            case 'confused': return <Activity className="w-8 h-8 text-purple-500" />;
            default: return <Meh className="w-8 h-8 text-gray-500" />;
        }
    };

    const getAttentionColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Convert timeline attention bool to format suitable for line chart
    const chartData = timeline.map(point => ({
        time: formatTime(point.timestamp),
        attentionLevel: point.attention ? 100 : 0,
        emotion: point.emotion
    }));

    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 my-6">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Activity className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Engagement & Emotion Analytics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center">
                    <Focus className={`w-8 h-8 mb-2 ${getAttentionColor(analytics.attentionScore)}`} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Attention Score</p>
                    <div className={`text-3xl font-bold ${getAttentionColor(analytics.attentionScore)}`}>
                        {analytics.attentionScore}%
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col items-center justify-center relative group">
                    {getEmotionIcon(analytics.dominantEmotion)}
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 mt-2">Dominant Emotion</p>
                    <div className="text-2xl font-bold text-purple-700 capitalize mb-1">
                        {analytics.dominantEmotion}
                    </div>
                    {/* Emotion Breakdown Hover or List */}
                    <div className="w-full mt-2">
                        <p className="text-xs text-gray-500 text-center mb-1">All Emotions Detected</p>
                        <div className="flex flex-wrap justify-center gap-1">
                            {analytics.emotionBreakdown && Object.entries(analytics.emotionBreakdown)
                                .sort((a, b) => b[1] - a[1]) // highest first
                                .map(([emo, pct]) => (
                                    <span key={emo} className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full capitalize">
                                        {emo}: {pct}%
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Focus Drops</p>
                    <div className="text-3xl font-bold text-red-600">
                        {analytics.focusDrops}
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center justify-center">
                    <Clock className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Session Duration</p>
                    <div className="text-3xl font-bold text-green-700">
                        {formatTime(analytics.sessionDuration)}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Attention Timeline</h4>
                <div className="h-64 w-full border rounded-lg bg-gray-50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={{ fontSize: 12 }} />
                            <RechartsTooltip
                                formatter={(_value: any, _name: any, props: any) => [
                                    props.payload.emotion, 'Detected Emotion'
                                ]}
                                labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Line
                                type="stepAfter"
                                dataKey="attentionLevel"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={false}
                                name="Attention"
                                isAnimationActive={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Chart shows continuous attention (100) and focus drops (0) alongside detected emotions.</p>
            </div>
        </div>
    );
}
