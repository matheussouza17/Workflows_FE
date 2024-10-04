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
  updateDepartment: (id: number, data: Partial<Department>) => Promise<void>;
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
      console.error("Erro ao buscar detalhes do departamento:", error);
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  }

  // Update department by ID
  async function updateDepartment(id: number, data: Partial<Department>) {
    setLoading(true);
    try {
      await api.put(`/department/${id}`, data);
      await fetchDepartmentById(id); // Atualiza o estado do departamento após a atualização
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DepartmentContext.Provider value={{ departments, department, loading, fetchDepartments, fetchDepartmentById, updateDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
}
