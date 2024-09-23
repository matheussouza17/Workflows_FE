import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import Router from 'next/router';
import { toast } from 'react-toastify';

type UserContextData = {
  upUser: (credentials: UserProps, photo: File | null) => Promise<void>;
  getUser: () => Promise<UserProps | null>;
  removePhoto: () => void;
};

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
  departmentId?: number;
  photo?: string;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Armazena o ID do usuário

  // Função para buscar dados do usuário e salvar no estado
  async function getUser(): Promise<UserProps | null> {
    try {
      const response = await api.get('/me'); // Certifique-se que essa rota é a correta para obter o usuário logado
      const { id, name, email, role, departmentId, photo } = response.data;
      setUserId(id);
      setUserPhoto(photo ? `data:image/jpeg;base64,${photo}` : null); // Convertendo Bytes para base64

      return {
        id,
        name,
        email,
        role,
        departmentId,
        photo: photo ? `data:image/jpeg;base64,${photo}` : undefined,
      };
    } catch (err) {
      console.log('Erro ao obter dados do usuário: ', err);
      return null;
    }
  }

  // Função para atualizar o usuário, incluindo a possibilidade de atualizar a foto
  async function upUser({ name, email, role, departmentId }: UserProps, photo: File | null) {
    try {
      if (!userId) {
        throw new Error("ID do usuário não encontrado");
      }

      // Atualiza as informações principais do usuário
      await api.put(`/user/${userId}`, {
        name,
        email,
        role,
        departmentId,
      });

      // Verifica se uma nova foto foi enviada e faz upload
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);

        await api.post('/user/upsert_photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Foto atualizada com sucesso!');
      }

      toast.success('Conta atualizada com sucesso!');
      Router.push('/dashboard'); // Redireciona para a dashboard
    } catch (err) {
      console.log('Erro ao atualizar: ', err);
      toast.error('Erro ao atualizar!');
    }
  }

  // Função para remover a foto do estado
  function removePhoto() {
    setUserPhoto(null);
    // Opcional: você pode implementar a chamada de API para remover a foto do servidor aqui
  }

  return (
    <UserContext.Provider value={{ upUser, getUser, removePhoto }}>
      {children}
    </UserContext.Provider>
  );
}
