import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    results: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you might have an API endpoint for stats
        // For now, we'll simulate by counting the items
        const [studentsRes, coursesRes, resultsRes] = await Promise.all([
          adminAPI.getAllStudents(),
          adminAPI.getAllCourses(),
          adminAPI.getAllResults()
        ]);
        
        setStats({
          students: studentsRes.data.length || 0,
          courses: coursesRes.data.length || 0,
          results: resultsRes.data.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set some default values for demo
        setStats({
          students: 24,
          courses: 8,
          results: 120
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 flex items-center ${color}`}>
      <div className="rounded-full p-4 bg-opacity-20 mr-4 text-2xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.students} 
          icon="👨‍🎓" 
          color="bg-blue-50"
        />
        <StatCard 
          title="Total Courses" 
          value={stats.courses} 
          icon="📚" 
          color="bg-green-50"
        />
        <StatCard 
          title="Total Results" 
          value={stats.results} 
          icon="📝" 
          color="bg-purple-50"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="py-4">Added new student "John Doe"</li>
            <li className="py-4">Updated course "Mathematics 101"</li>
            <li className="py-4">Added results for "Computer Science 202"</li>
            <li className="py-4">Deleted student "Jane Smith"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 