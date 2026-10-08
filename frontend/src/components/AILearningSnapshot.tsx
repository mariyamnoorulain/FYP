import { TrendingUp, TrendingDown, Brain, Target } from 'lucide-react';

interface AILearningSnapshotProps {
  courseStats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    completionPercentage: number;
  };
  emotionalAnalytics: {
    dominantEmotion: string;
    averageAttention: number;
    emotionBreakdown: Record<string, number>;
  };
  totalFocusDrops: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  performanceChange: number;
  averageQuizScore: number;
}

export default function AILearningSnapshot({
  courseStats,
  emotionalAnalytics,
  totalFocusDrops,
  performanceTrend,
  performanceChange,
  averageQuizScore
}: AILearningSnapshotProps) {
  const getTrendIcon = () => {
    if (performanceTrend === 'improving') {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    } else if (performanceTrend === 'declining') {
      return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
    return <Brain className="w-5 h-5 text-blue-600" />;
  };

  const getTrendColor = () => {
    if (performanceTrend === 'improving') return 'text-green-600';
    if (performanceTrend === 'declining') return 'text-red-600';
    return 'text-blue-600';
  };

  const dominantEmotion = emotionalAnalytics.dominantEmotion
    ? `${emotionalAnalytics.dominantEmotion.charAt(0).toUpperCase()}${emotionalAnalytics.dominantEmotion.slice(1)}`
    : 'Neutral';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">AI Learning Snapshot</h2>
        <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
          Real-time AI Analysis
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Learning Progress */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">AI Tracked</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {courseStats.completedCourses}/{courseStats.totalCourses}
          </div>
          <div className="text-sm text-gray-600 mb-2">Courses Completed</div>
          <div className="text-xs text-gray-500 italic">In progress: {courseStats.inProgressCourses}</div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${courseStats.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* 2. Emotional Engagement (AI) */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded">AI Detected</span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">😊</span>
                <span className="text-sm text-gray-700">Average Attention</span>
              </div>
              <span className="text-lg font-bold text-green-600">{emotionalAnalytics.averageAttention}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">😐</span>
                <span className="text-sm text-gray-700">Confused</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{emotionalAnalytics.emotionBreakdown.confused || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">😴</span>
                <span className="text-sm text-gray-700">Overall Emotion</span>
              </div>
              <span className="text-lg font-bold text-red-600">{dominantEmotion}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 italic mt-2">
            Overall average emotional and attention analytics of the student
          </div>
        </div>

        {/* 3. Overall Focus Drops */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">Lecture Analytics</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm text-gray-700">Overall focus drops</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{totalFocusDrops}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔁</span>
                <span className="text-sm text-gray-700">Average attention</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{emotionalAnalytics.averageAttention}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <span className="text-sm text-gray-700">Dominant emotion</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{dominantEmotion}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 italic mt-2">
            Calculated from all saved lecture analytics
          </div>
        </div>

        {/* 4. Performance Trend */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              {getTrendIcon()}
            </div>
            <span className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded">Quiz Based</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {performanceTrend === 'improving' ? '↑' : performanceTrend === 'declining' ? '↓' : '→'}
            </span>
            <span className={`text-xl font-bold ${getTrendColor()}`}>
              {performanceTrend === 'improving' ? 'Improving' : performanceTrend === 'declining' ? 'Declining' : 'Stable'}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Average quiz result: {averageQuizScore}%
          </div>
          <div className="text-xs text-gray-500 italic">
            Trend change: {performanceChange > 0 ? '+' : ''}{performanceChange}%
          </div>
        </div>
      </div>
    </div>
  );
}
