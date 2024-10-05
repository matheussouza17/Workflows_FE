import { useContext, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken'; 

type DecodedToken = {
  role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
};

export function Header() {
  const { user, signOut } = useContext(AuthContext);
  const [userRole, setUserRole] = useState<DecodedToken['role'] | null>(null);

  useEffect(() => {
    const { '@workflows.token': token } = parseCookies();
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as DecodedToken; 
        if (decodedToken && decodedToken.role) {
          setUserRole(decodedToken.role); 
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, []);

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <Link href="/home">
          <img src="/workflows-logo.png" width={190} height={100} alt="Logo Workflows" />
        </Link>

        <nav className={styles.menuNav}>
          <div className={styles.imageProfile}>
          <Image
              src={user?.photo || '/photoDefault.png'}
              alt="User Photo"
              className={styles.profilePhoto}
              width={50}
              height={50}
            />
          </div>
          {(userRole === 'Accounting' || userRole === 'CFO') && (
            <>
              <Link href="/departmentlist">Departments</Link>
              <Link href="/categorylist">Categories</Link>
            </>
          )}
          <Link href="/approvallist">Approvals</Link>
          <Link href="/home" onClick={signOut}><FiLogOut color="#FFF" size={24} /></Link>
        </nav>
      </div>
    </aside>
  );
}
