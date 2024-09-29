import {AppProps } from 'next/app';
import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import {AuthProvider} from '../contexts/AuthContext'
import { UserProvider } from '../contexts/UserContext';
import {DepartmentProvider} from '../contexts/DepartmentContext';
import { CategoryProvider } from '../contexts/CategoryContext';
import { ApprovalProvider } from '../contexts/ApprovalContext';


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
        <UserProvider>
            <DepartmentProvider>
              <CategoryProvider>
              <ApprovalProvider>
              <Component {...pageProps} /> 
              <ToastContainer autoClose={3000}/>  
              </ApprovalProvider>
              </CategoryProvider>
            </DepartmentProvider>    
        </UserProvider>
    </AuthProvider>
  ) 
}

export default MyApp
