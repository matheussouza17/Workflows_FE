import { ReactNode } from 'react';
import styles from './styles.module.scss';

type MainLayoutProps = {
  children: ReactNode;
  withSidebar?: boolean; // Adiciona uma opção para indicar se queremos o sidebar
};

const MainLayout = ({ children, withSidebar = true }: MainLayoutProps) => {
  return (
    <div className={withSidebar ? styles.mainLayoutWithSidebar : styles.mainLayout}>
      {children}
    </div>
  );
};

export default MainLayout;
