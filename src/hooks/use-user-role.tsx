"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'parent';

interface UserRoleContextType {
  role: UserRole;
  studentId: string | null;
  setLogin: (role: UserRole, studentId?: string) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('parent');
  const [studentId, setStudentId] = useState<string | null>(null);

  const setLogin = (role: UserRole, studentId?: string) => {
    setRole(role);
    setStudentId(studentId || null);
  };

  return (
    <UserRoleContext.Provider value={{ role, studentId, setLogin }}>
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
