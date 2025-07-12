import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState({
    studentId: '',
    courseId: '',
    marks: '',
    grade: '',
    semester: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resultsRes, studentsRes, coursesRes] = await Promise.all([
        adminAPI.getAllResults(),
        adminAPI.getAllStudents(),
        adminAPI.getAllCourses(),
      ]);
      
      setResults(resultsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 85) return 'A';
    if (marks >= 80) return 'A-';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B-';
    if (marks >= 60) return 'C+';
    if (marks >= 55) return 'C';
    if (marks >= 50) return 'C-';
    if (marks >= 45) return 'D+';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'marks') {
      const marks = parseInt(value);
      if (!isNaN(marks)) {
        const grade = calculateGrade(marks);
        setCurrentResult({ ...currentResult, marks, grade });
      } else {
        setCurrentResult({ ...currentResult, [name]: value });
      }
    } else {
      setCurrentResult({ ...currentResult, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminAPI.updateResult(currentResult._id, currentResult);
      } else {
        await adminAPI.addResult(currentResult);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error('Error saving result:', err);
      closeModal();
      fetchData();
    }
  };

  const handleEdit = (result) => {
    setCurrentResult({ ...result });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await adminAPI.deleteResult(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting result:', err);
        fetchData();
      }
    }
  };

  const openAddModal = () => {
    setCurrentResult({
      studentId: '',
      courseId: '',
      marks: '',
      grade: '',
      semester: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s._id === studentId || s.studentId === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId || c.code === courseId);
    return course ? course.name : 'Unknown Course';
  };

  const filteredResults = results.filter(
    (result) =>
      getStudentName(result.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseName(result.courseId || result.courseCode).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.courseCode && result.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.semester && result.semester.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-10">Loading results...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Results Management</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Result
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search results..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={result._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStudentName(result.studentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.courseName || getCourseName(result.courseId || result.courseCode)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{result.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(result)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(result._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Result' : 'Add New Result'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Student
                </label>
                <select
                  name="studentId"
                  value={currentResult.studentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Course
                </label>
                <select
                  name="courseId"
                  value={currentResult.courseId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Semester
                </label>
                <select
                  name="semester"
                  value={currentResult.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  min="0"
                  max="100"
                  value={currentResult.marks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Grade (Auto-calculated)
                </label>
                <input
                  type="text"
                  name="grade"
                  value={currentResult.grade}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {isEditing ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results; 