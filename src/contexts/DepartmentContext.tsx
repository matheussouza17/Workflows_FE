import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';

type Department = {
  id: number;
  name: string;
  code: string;
  description?: string;
};

type DepartmentContextData = {
  departments: Department[];
  department: Department | null;
  loading: boolean;
  fetchDepartments: () => Promise<void>;
  fetchDepartmentById: (id: number) => Promise<void>;
};

type DepartmentProviderProps = {
  children: ReactNode;
};

export const DepartmentContext = createContext({} as DepartmentContextData);

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all departments
  async function fetchDepartments() {
    setLoading(true);
    try {
      const response = await api.get('/department');
      setDepartments(response.data);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch department by ID
  async function fetchDepartmentById(id: number) {
    setLoading(true);
    try {
      const response = await api.get(`/department/${id}`);
      setDepartment(response.data);
    } catch (error) {
      console.error('Erro ao buscar o departamento:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DepartmentContext.Provider value={{ departments, department, loading, fetchDepartments, fetchDepartmentById }}>
      {children}
    </DepartmentContext.Provider>
  );
}
