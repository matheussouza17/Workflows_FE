import { FC } from 'react';
import styles from './styles.module.scss';

type DataTableProps<T> = {
  data: T[];
  columns: { key: string | number | symbol; label: string; render?: (item: T) => React.ReactNode }[];
  onRowClick?: (item: T) => void;
  actionLabel?: string;
  onActionClick?: (item: T) => void;
};

const DataTable = <T,>({ data, columns, onRowClick, actionLabel, onActionClick }: DataTableProps<T>) => {
  return (
    <table className={styles.dataTable}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
          {onActionClick && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} onClick={() => onRowClick && onRowClick(item)}>
            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render ? col.render(item) : String(item[col.key as keyof T])}
              </td>
            ))}
            {onActionClick && (
              <td>
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita chamar `onRowClick` quando o botão é clicado
                    onActionClick(item);
                  }}
                >
                  {actionLabel}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
