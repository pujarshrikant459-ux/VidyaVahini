
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { students as initialStudents } from "@/lib/data";
import type { Student, FeeRecord, BehavioralNote } from "@/lib/types";
import { useUserRole } from './use-user-role';

interface StudentsContextType {
  students: Student[];
  currentStudent: Student | null;
  updateStudent: (updatedStudent: Student) => void;
  addStudent: (newStudentData: Omit<Student, 'id' | 'attendance' | 'fees' | 'behavioralNotes'>) => void;
  deleteStudent: (studentId: string) => void;
  updateStudentAttendance: (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => void;
  payFee: (studentId: string, feeId: string) => void;
  addFee: (studentId: string, feeData: Omit<FeeRecord, 'id' | 'status'>) => void;
  approveFee: (studentId: string, feeId: string) => void;
  addBehavioralNote: (studentId: string, note: string, teacher: string) => void;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

const STUDENTS_STORAGE_KEY = 'vva-students';

export function StudentsProvider({ children }: { children: ReactNode }) {
  const { role, studentId } = useUserRole();
  
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === 'undefined') {
      return initialStudents;
    }
    const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
    try {
        if (storedStudents) {
            const parsedStudents = JSON.parse(storedStudents);
            // Quick validation to ensure behavioralNotes is an array
            return parsedStudents.map((s: Student) => ({ ...s, behavioralNotes: s.behavioralNotes || []}));
        }
    } catch (e) {
        console.error("Failed to parse students from localStorage", e);
    }
    return initialStudents;
  });

  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STUDENTS_STORAGE_KEY && event.newValue) {
        try {
            const parsedStudents = JSON.parse(event.newValue);
            setStudents(parsedStudents.map((s: Student) => ({ ...s, behavioralNotes: s.behavioralNotes || []})));
        } catch (e) {
            console.error("Failed to parse students from storage event", e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentStudent = useMemo(() => {
    if (role === 'parent' && studentId) {
      return students.find(s => s.id === studentId) || null;
    }
    return null;
  }, [role, studentId, students]);

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  
  const addStudent = (newStudentData: Omit<Student, 'id' | 'attendance' | 'fees' | 'behavioralNotes'>) => {
     const newStudent: Student = {
      ...newStudentData,
      id: `s-${Date.now()}`,
      attendance: [],
      fees: [],
      behavioralNotes: [],
    };
    setStudents(prev => [newStudent, ...prev]);
  };
  
  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }
  
  const updateStudentAttendance = (studentId: string, day: Date, status: 'present' | 'absent' | 'late') => {
    const dateString = day.toISOString().split('T')[0];
    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === studentId) {
          const newAttendance = [...s.attendance];
          const existingRecordIndex = newAttendance.findIndex(
            (a) => a.date === dateString
          );

          if (existingRecordIndex > -1) {
            newAttendance[existingRecordIndex] = { date: dateString, status };
          } else {
            newAttendance.push({ date: dateString, status });
          }
          
          return { ...s, attendance: newAttendance };
        }
        return s;
      })
    );
  };
  
  const payFee = (studentId: string, feeId: string) => {
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            fees: student.fees.map(fee => {
              if (fee.id === feeId) {
                return { ...fee, status: 'paid', paidDate: new Date().toISOString().split('T')[0] };
              }
              return fee;
            }),
          };
        }
        return student;
      })
    );
  };

  const addFee = (studentId: string, feeData: Omit<FeeRecord, 'id' | 'status'>) => {
    const newFee: FeeRecord = {
      ...feeData,
      id: `fee-${Date.now()}`,
      status: 'pending',
    };
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            fees: [newFee, ...student.fees],
          };
        }
        return student;
      })
    );
  };
  
  const approveFee = (studentId: string, feeId: string) => {
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            fees: student.fees.map(fee => {
              if (fee.id === feeId) {
                return { ...fee, status: 'approved' };
              }
              return fee;
            }),
          };
        }
        return student;
      })
    );
  };

  const addBehavioralNote = (studentId: string, note: string, teacher: string) => {
    const newNote: BehavioralNote = {
      id: `bn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      note,
      teacher,
    };
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            behavioralNotes: [newNote, ...(student.behavioralNotes || [])],
          };
        }
        return student;
      })
    );
  };

  return (
    <StudentsContext.Provider value={{ students, currentStudent, updateStudent, addStudent, deleteStudent, updateStudentAttendance, payFee, addFee, approveFee, addBehavioralNote }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}
