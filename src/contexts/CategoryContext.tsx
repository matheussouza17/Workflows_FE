import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/apiClient';

type Category = {
  id: number;
  name: string;
  description?: string;
};

type CategoryContextData = {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
};

type CategoryProviderProps = {
  children: ReactNode;
};

export const CategoryContext = createContext({} as CategoryContextData);

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  async function fetchCategories() {
    setLoading(true);
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch category by ID
  async function fetchCategoryById(id: number) {
    setLoading(true);
    try {
      const response = await api.get(`/category/${id}`);
      setCategory(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da categoria:', error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }

  // Update category by ID
  async function updateCategory(id: number, data: Partial<Category>) {
    setLoading(true);
    try {
      await api.put(`/category/${id}`, data);
      await fetchCategoryById(id); // Atualiza o estado da categoria após a atualização
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CategoryContext.Provider
      value={{ categories, category, loading, fetchCategories, fetchCategoryById, updateCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
