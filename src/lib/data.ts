import type { Student, Teacher, Homework, TimetableEntry, Transport } from './types';
import { PlaceHolderImages } from './placeholder-images';

const student1Photo = PlaceHolderImages.find(p => p.id === 'student-1')?.imageUrl || '';
const student2Photo = PlaceHolderImages.find(p => p.id === 'student-2')?.imageUrl || '';
const student3Photo = PlaceHolderImages.find(p => p.id === 'student-3')?.imageUrl || '';

const headmasterPhoto = PlaceHolderImages.find(p => p.id === 'staff-headmaster')?.imageUrl || '';
const teacher1Photo = PlaceHolderImages.find(p => p.id === 'staff-teacher-1')?.imageUrl || '';
const teacher2Photo = PlaceHolderImages.find(p => p.id === 'staff-teacher-2')?.imageUrl || '';

const driver1Photo = PlaceHolderImages.find(p => p.id === 'driver-1')?.imageUrl || '';

export const students: Student[] = [
  {
    id: '1',
    name: 'Akash Kumar',
    class: '10th A',
    rollNumber: '10A-01',
    photo: student1Photo,
    contact: '9876543210',
    attendance: [
      { date: '2023-10-01', status: 'present' },
      { date: '2023-10-02', status: 'present' },
      { date: '2023-10-03', status: 'absent' },
      { date: '2023-10-04', status: 'present' },
    ],
    fees: [
      { id: 'fee1', type: 'Tuition Fee', amount: 5000, dueDate: '2023-11-15', status: 'paid', paidDate: '2023-11-10', description: 'Quarterly tuition fee.' },
      { id: 'fee2', type: 'Exam Fee', amount: 1000, dueDate: '2023-12-01', status: 'pending', description: 'Final term examination fee.' },
    ],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    class: '9th B',
    rollNumber: '09B-15',
    photo: student2Photo,
    contact: '9988776655',
    attendance: [
      { date: '2023-10-01', status: 'present' },
      { date: '2023-10-02', status: 'late' },
      { date: '2023-10-03', status: 'present' },
      { date: '2023-10-04', status: 'present' },
    ],
    fees: [
      { id: 'fee3', type: 'Tuition Fee', amount: 4500, dueDate: '2023-11-15', status: 'paid', paidDate: '2023-11-05', description: 'Quarterly tuition fee.' },
      { id: 'fee4', type: 'Sports Fee', amount: 1500, dueDate: '2023-11-20', status: 'overdue', description: 'Annual sports participation fee.' },
    ],
  },
  {
    id: '3',
    name: 'Rohan Singh',
    class: '10th A',
    rollNumber: '10A-02',
    photo: student3Photo,
    contact: '9123456789',
    attendance: [],
    fees: [],
  },
];

export const teachers: Teacher[] = [
  {
    id: 'hm-01',
    name: 'Dr. Anjali Rao',
    role: 'Head Master',
    photo: headmasterPhoto,
    contact: '8123456789',
  },
  {
    id: 't-01',
    name: 'Mr. Ramesh Gupta',
    role: 'Teacher',
    subject: 'Mathematics',
    photo: teacher1Photo,
    contact: '8987654321',
  },
  {
    id: 't-02',
    name: 'Mrs. Sunita Devi',
    role: 'Teacher',
    subject: 'Science',
    photo: teacher2Photo,
    contact: '8765432109',
  },
];

export const homework: Homework[] = [
    { id: 'hw-1', subject: 'Mathematics', title: 'Algebra Chapter 5', assignedDate: '2023-10-25', dueDate: '2023-10-28', description: 'Solve all problems from exercise 5.3.', teacher: 'Mr. Ramesh Gupta' },
    { id: 'hw-2', subject: 'Science', title: 'Biology: Cell Structure', assignedDate: '2023-10-26', dueDate: '2023-10-29', description: 'Draw and label a plant cell and an animal cell.', teacher: 'Mrs. Sunita Devi' },
    { id: 'hw-3', subject: 'History', title: 'The Mauryan Empire', assignedDate: '2023-10-27', dueDate: '2023-10-30', description: 'Write a short note on Ashoka\'s reign.', teacher: 'Mr. Anand Sharma'},
];

export const timetable: TimetableEntry[] = [
    { day: 'Monday', periods: [
        { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Ramesh Gupta'},
        { time: '10:00 - 11:00', subject: 'Science', teacher: 'Mrs. Sunita Devi'},
        { time: '11:00 - 12:00', subject: 'English', teacher: 'Mrs. Priya Kumar'},
    ]},
    { day: 'Tuesday', periods: [
        { time: '09:00 - 10:00', subject: 'Kannada', teacher: 'Mr. Suresh Patil'},
        { time: '10:00 - 11:00', subject: 'Mathematics', teacher: 'Mr. Ramesh Gupta'},
        { time: '11:00 - 12:00', subject: 'Social Science', teacher: 'Mr. Anand Sharma'},
    ]},
];

export const transport: Transport[] = [
  {
    id: 'bus-1',
    busNumber: 'KA-01-F-1234',
    route: 'Majestic to School',
    driver: {
      name: 'Ravi Kumar',
      photo: driver1Photo,
      mobile: '9876512345',
    },
    stops: [
      { stop: 'Majestic Bus Stand', pickupTime: '07:30 AM', dropTime: '04:30 PM' },
      { stop: 'Malleshwaram Circle', pickupTime: '07:45 AM', dropTime: '04:15 PM' },
      { stop: 'School Campus', pickupTime: '08:15 AM', dropTime: '04:00 PM' },
    ],
  },
];
