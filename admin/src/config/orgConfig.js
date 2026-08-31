// =============================================
// SHARED CONFIG: Wings, Programs, Levels
// Used by: StudentManagement, ResultManagement, etc.
// =============================================

export const WINGS = ['School', 'Plus2', 'Bachelors'];

export const PROGRAMS = {
  School: [
    { id: 'sch-primary', name: 'Primary (1-5)', type: 'year' },
    { id: 'sch-secondary', name: 'Secondary (6-10)', type: 'year' },
  ],
  Plus2: [
    { id: 'p2-science', name: 'Science', type: 'year' },
    { id: 'p2-mgmt', name: 'Management', type: 'year' },
  ],
  Bachelors: [
    { id: 'bca', name: 'BCA', type: 'semester' },
    { id: 'bbs', name: 'BBS', type: 'year' },
    { id: 'csit', name: 'CSIT', type: 'semester' },
    { id: 'bit', name: 'BIT', type: 'semester' },
    { id: 'bsc', name: 'BSc', type: 'year' },
  ],
};

export const LEVELS = {
  'sch-primary': ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
  'sch-secondary': ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
  'p2-science': ['Grade 11', 'Grade 12'],
  'p2-mgmt': ['Grade 11', 'Grade 12'],
  'bca': ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
  'bbs': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  'csit': ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
  'bit': ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
  'bsc': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
};

export const TERMINALS = ['First Terminal', 'Second Terminal', 'Third Terminal', 'Fourth Terminal'];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const STUDENT_STATUSES = ['Active', 'Passed Out', 'Dropped', 'Transferred'];

// Organization info (will come from API later)
export const ORG_INFO = {
  name: 'Sunrise Academy',
  address: 'Kathmandu, Nepal',
  phone: '01-4XXXXXX',
  email: 'info@sunriseacademy.edu.np',
  website: 'www.sunriseacademy.edu.np',
  established: '2050 BS',
  panNo: '123456789',
  logo: null, // URL or base64
  currentSession: '2081/2082',
};
