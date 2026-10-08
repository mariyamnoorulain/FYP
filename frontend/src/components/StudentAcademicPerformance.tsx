import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

interface PerformanceData {
  session: string;
  quizScore: number;
  completionRate: number;
}

interface StudentAcademicPerformanceProps {
  performanceData: PerformanceData[];
}

export default function StudentAcademicPerformance({ performanceData }: StudentAcademicPerformanceProps) {
  const avgQuizScore = performanceData.length
    ? performanceData.reduce((sum, item) => sum + item.quizScore, 0) / performanceData.length
    : 0;
  const avgCompletionRate = performanceData.length
    ? performanceData.reduce((sum, item) => sum + item.completionRate, 0) / performanceData.length
    : 0;
  const improvement = performanceData.length > 1 && performanceData[0].quizScore
    ? ((performanceData[performanceData.length - 1].quizScore - performanceData[0].quizScore) / performanceData[0].quizScore) * 100
    : 0;

  const chartData = performanceData.map((item) => ({
    session: item.session,
    'Quiz Score': item.quizScore,
    'Completion Rate': item.completionRate
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Academic Performance</h3>
            <p className="text-sm text-gray-500">Learning metrics over time</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{avgQuizScore.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 mt-1">Avg Quiz Score</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{avgCompletionRate.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 mt-1">Completion Rate</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{improvement.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 mt-1">Improvement</div>
          </div>
        </div>

        {performanceData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No quiz results are available yet. Complete a lecture and finish its quiz to populate academic performance.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="session" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis domain={[0, 100]} stroke="#6b7280" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="Quiz Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completion Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
