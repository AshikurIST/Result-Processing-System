import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls
        // For demo, we'll use mock data if API calls fail
        try {
          const profileRes = await studentAPI.getProfile();
          setProfile(profileRes.data);
        } catch (err) {
          // Mock data
          setProfile({
            studentId: 'S001',
            name: 'John Doe',
            email: 'john@example.com',
            semester: '3rd',
            department: 'Computer Science',
          });
        }

        try {
          const coursesRes = await studentAPI.getCourses();
          setCourses(coursesRes.data);
        } catch (err) {
          // Mock data
          setCourses([
            { _id: '1', code: 'CSE101', name: 'Introduction to Programming', credits: 3 },
            { _id: '2', code: 'CSE102', name: 'Data Structures', credits: 3 },
            { _id: '3', code: 'MATH101', name: 'Calculus', credits: 3 },
          ]);
        }

        try {
          const resultsRes = await studentAPI.getResults();
          setResults(resultsRes.data);
        } catch (err) {
          // Mock data
          setResults([
            { _id: '1', courseCode: 'CSE101', courseName: 'Introduction to Programming', semester: '1st', marks: 85, grade: 'A' },
            { _id: '2', courseCode: 'MATH101', courseName: 'Calculus', semester: '1st', marks: 78, grade: 'B+' },
            { _id: '3', courseCode: 'CSE102', courseName: 'Data Structures', semester: '2nd', marks: 90, grade: 'A+' },
          ]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load your data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <div className="flex items-center">
            <span className="mr-4">{profile?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">My Profile</h2>
            {profile && (
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Student ID:</span> {profile.studentId}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Name:</span> {profile.name}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Email:</span> {profile.email}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Semester:</span> {profile.semester}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Department:</span> {profile.department}
                </p>
              </div>
            )}
          </div>

          {/* Courses Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Enrolled Courses</h2>
            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <li key={course._id} className="py-2">
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-600">
                      {course.code} - {course.credits} credits
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Results Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Recent Results</h2>
            {results.length === 0 ? (
              <p>No results found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {results.slice(0, 3).map((result) => (
                  <li key={result._id} className="py-2">
                    <p className="font-medium">{result.courseName}</p>
                    <div className="flex justify-between text-sm">
                      <span>{result.courseCode}</span>
                      <span className="font-bold">
                        Grade: {result.grade} ({result.marks})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Link
                to="/student/results"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View all results →
              </Link>
            </div>
          </div>
        </div>

        {/* Semester Results */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-indigo-600">Semester-wise Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{result.courseCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.marks}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{result.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Download Marksheet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard; 