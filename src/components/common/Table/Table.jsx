import { memo } from 'react';
import styles from './Table.module.scss';

const Table = memo(({ columns, children, className = '' }) => (
  <div className={`${styles.wrapper} ${className}`}>
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={column.hideOnMobile ? styles.hideMobile : ''}
              style={{ width: column.width }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
));

Table.displayName = 'Table';

export default Table;
