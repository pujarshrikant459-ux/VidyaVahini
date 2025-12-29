
export type UserRole = 'admin' | 'parent' | 'teacher';

export interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  contact: string;
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  behavioralNotes: BehavioralNote[];
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface FeeRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'approved';
  paidDate?: string;
  description: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  subject?: string;
  classAssigned?: string;
  contact: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  teacher: string;
}

export interface TimetableEntry {
  day: string;
  periods: { time: string; subject: string; teacher: string }[];
}

export interface TransportStop {
  stop: string;
  pickupTime: string;
  dropTime: string;
}

export interface Transport {
  id: string;
  busNumber: string;
  route: string;
  driver: {
    name: string;
    mobile: string;
  };
  stops: TransportStop[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface BehavioralNote {
  id: string;
  date: string;
  note: string;
  teacher: string;
}
