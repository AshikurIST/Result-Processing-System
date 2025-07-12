import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for demonstration
const mockData = {
  students: [
    { _id: '1', studentId: 'S001', name: 'John Doe', email: 'john@example.com', semester: '3rd', department: 'CSE' },
    { _id: '2', studentId: 'S002', name: 'Jane Smith', email: 'jane@example.com', semester: '2nd', department: 'EEE' },
    { _id: '3', studentId: 'S003', name: 'Bob Johnson', email: 'bob@example.com', semester: '3rd', department: 'CSE' },
  ],
  courses: [
    { _id: '1', code: 'CSE101', name: 'Introduction to Programming', credits: 3 },
    { _id: '2', code: 'CSE102', name: 'Data Structures', credits: 3 },
    { _id: '3', code: 'MATH101', name: 'Calculus', credits: 3 },
  ],
  results: [
    { _id: '1', courseCode: 'CSE101', courseName: 'Introduction to Programming', semester: '1st', marks: 85, grade: 'A' },
    { _id: '2', courseCode: 'MATH101', courseName: 'Calculus', semester: '1st', marks: 78, grade: 'B+' },
    { _id: '3', courseCode: 'CSE102', courseName: 'Data Structures', semester: '2nd', marks: 90, grade: 'A+' },
  ]
};

// Helper function to simulate API calls
const mockApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Student API calls with mock data
export const studentAPI = {
  getProfile: () => mockApiCall(mockData.students[0]),
  getCourses: () => mockApiCall(mockData.courses),
  getResults: () => mockApiCall(mockData.results),
  getResultBySemester: (semester) => mockApiCall(mockData.results.filter(r => r.semester === semester)),
};

// Admin API calls with mock data
export const adminAPI = {
  // Student management
  getAllStudents: () => mockApiCall(mockData.students),
  getStudent: (id) => mockApiCall(mockData.students.find(s => s._id === id)),
  addStudent: (data) => mockApiCall({ ...data, _id: Date.now().toString() }),
  updateStudent: (id, data) => mockApiCall({ ...data, _id: id }),
  deleteStudent: (id) => mockApiCall({ success: true }),
  
  // Course management
  getAllCourses: () => mockApiCall(mockData.courses),
  getCourse: (id) => mockApiCall(mockData.courses.find(c => c._id === id)),
  addCourse: (data) => mockApiCall({ ...data, _id: Date.now().toString() }),
  updateCourse: (id, data) => mockApiCall({ ...data, _id: id }),
  deleteCourse: (id) => mockApiCall({ success: true }),
  
  // Result management
  getAllResults: () => mockApiCall(mockData.results),
  getResult: (id) => mockApiCall(mockData.results.find(r => r._id === id)),
  addResult: (data) => mockApiCall({ ...data, _id: Date.now().toString() }),
  updateResult: (id, data) => mockApiCall({ ...data, _id: id }),
  deleteResult: (id) => mockApiCall({ success: true }),
};

export default api; 