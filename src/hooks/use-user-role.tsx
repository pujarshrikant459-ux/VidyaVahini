
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'parent';

interface UserRoleContextType {
  role: UserRole;
  studentId: string | null;
  schoolId: string | null;
  schoolName: string | null;
  setLogin: (role: UserRole, details?: { studentId?: string; schoolId?: string; schoolName?: string }) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('parent');
  const [studentId, setStudentId] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);

  const setLogin = (role: UserRole, details?: { studentId?: string; schoolId?: string; schoolName?: string }) => {
    setRole(role);
    setStudentId(details?.studentId || null);
    setSchoolId(details?.schoolId || null);
    setSchoolName(details?.schoolName || null);
  };

  return (
    <UserRoleContext.Provider value={{ role, studentId, schoolId, schoolName, setLogin }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
