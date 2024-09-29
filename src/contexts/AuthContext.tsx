import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps | undefined;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    department?: string;
    photo?: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
    role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    department?: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@workflows.token');
        Router.push('/');
    } catch {
        console.log('Erro ao deslogar');
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@workflows.token': token } = parseCookies();
    
        if (token) {
            api.get('/me').then(response => {
                const { id, name, email, role, department, file } = response.data;
    
                setUser({
                    id,
                    name,
                    email,
                    role,
                    department,
                    photo: file ? `data:image/jpeg;base64,${file}` : '/photoDefault.png' 
                });
            })
            .catch(() => {
                console.error('Erro ao buscar dados do usuário');
                signOut();
            });
        }
    }, []);

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', { // Usando a rota correta
                email,
                password
            });

            const { id, name, role, department, token, file } = response.data;

            setCookie(undefined, '@workflows.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expira em 1 mês
                path: '/' 
            });

            setUser({
                id,
                name,
                email,
                role,
                department,
                photo: file ? `data:image/jpeg;base64,${file}` : '/photoDefault.png'
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success("Login realizado com sucesso!");
            Router.push('/home'); 
        }
        catch (err) {
            console.log('Erro ao acessar ', err);
            toast.error("Erro ao acessar!");
        }
    }

    async function signUp({ name, email, password, role, department }: SignUpProps) {
        try {
            await api.post('/user', { 
                name,
                email,
                password,
                role,
                department 
            });

            toast.success('Usuário cadastrado com sucesso!');
            signIn({ email, password });
        }
        catch (err) {
            console.log('Erro ao cadastrar: ', err);
            toast.error("Erro ao cadastrar!");
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
