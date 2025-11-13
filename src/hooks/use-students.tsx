"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { students as initialStudents } from "@/lib/data";
import type { Student, AttendanceRecord } from "@/lib/types";

interface StudentsContextType {
  students: Student[];
  updateStudent: (updatedStudent: Student) => void;
  addStudent: (newStudentData: Omit<Student, 'id' | 'attendance' | 'fees'>) => void;
  updateStudentAttendance: (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => void;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

const STUDENTS_STORAGE_KEY = 'vva-students';

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === 'undefined') {
      return initialStudents;
    }
    const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return storedStudents ? JSON.parse(storedStudents) : initialStudents;
  });

  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STUDENTS_STORAGE_KEY && event.newValue) {
        setStudents(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  
  const addStudent = (newStudentData: Omit<Student, 'id' | 'attendance' | 'fees'>) => {
     const newStudent: Student = {
      ...newStudentData,
      id: `s-${Date.now()}`,
      attendance: [],
      fees: [],
    };
    setStudents(prev => [newStudent, ...prev]);
  };
  
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


  return (
    <StudentsContext.Provider value={{ students, updateStudent, addStudent, updateStudentAttendance }}>
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
