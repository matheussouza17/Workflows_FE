import {AppProps } from 'next/app';
import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import {AuthProvider} from '../contexts/AuthContext'
import { UserProvider } from '../contexts/UserContext';


function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
        <UserProvider>
            <Component {...pageProps} /> 
            <ToastContainer autoClose={3000}/>  
        </UserProvider>
    </AuthProvider>
  ) 
}

export default MyApp
