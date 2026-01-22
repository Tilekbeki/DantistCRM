import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface PaginationListProps<T> {
  entities: T[];
  columns: TableColumnsType<T>;
  loading?: boolean;
  pageSize?: number;
}

const PaginationList = <T extends { key: React.Key }>({
  entities,
  columns,
  loading = false,
  pageSize = 16,
}: PaginationListProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      dataSource={entities}
      loading={loading}
      pagination={{ pageSize }}
    />
  );
};

export default PaginationList;
