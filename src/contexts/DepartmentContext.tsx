import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/apiClient';

type Department = {
  id: number;
  code: string;
  name: string;
  approvalDirectorId?: string | null
};

type DepartmentContextData = {
  departments: Department[];
  department: Department | null;
  loading: boolean;
  fetchDepartments: () => Promise<void>;
  fetchDepartmentById: (id: number) => Promise<Department | null>;
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
  async function fetchDepartmentById(id: number): Promise<Department | null> {
    setLoading(true);
    try {
      const response = await api.get(`/department/${id}`);
      if (response.data && response.data.length > 0) {
        setDepartment(response.data[0]);
        return response.data[0];
      }      
    } catch (error) {
      console.error('Erro ao buscar o departamento:', error);
    } finally {
      setLoading(false);
    }
    return null; 
  }

  // Update department by ID
  async function updateDepartment(id: number, data: Partial<Department>) {
    setLoading(true);
    try {
      await api.put(`/department/${id}`, data);
      console.log(data.approvalDirectorId)
      await fetchDepartmentById(id); 
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
