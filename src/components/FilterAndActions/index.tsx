import { FC } from 'react';
import styles from './styles.module.scss';
import { Button } from '../ui/Button';
import { FaPlus } from 'react-icons/fa';

type FilterAndActionsProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  buttonLabel: string;
  onButtonClick: () => void;
};

const FilterAndActions: FC<FilterAndActionsProps> = ({ searchTerm, setSearchTerm, buttonLabel, onButtonClick }) => {
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search"
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        className={styles.createButton}
        onClick={onButtonClick}
      >
        <FaPlus className={styles.plusIcon} /> {buttonLabel}
      </Button>
    </div>
  );
};

export default FilterAndActions;
