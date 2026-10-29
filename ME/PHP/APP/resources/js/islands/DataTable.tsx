import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';

interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: unknown, row: T) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  size?: number;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = col.accessorKey ? row[col.accessorKey] : '';
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const lower = value.toLowerCase();
        result = result.filter((row) =>
          String(row[key]).toLowerCase().includes(lower)
        );
      }
    });

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortConfig, filters, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pagination, pageSize, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = search || Object.values(filters).some(Boolean) || sortConfig;

  return (
    <div className={clsx('bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden', className)}>
      {/* Toolbar */}
      {(searchable || filterable || sortable || hasActiveFilters) && (
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {searchable && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </motion.button>
              )}
            </div>
          </div>
          {filterable && columns.some((c) => c.enableFiltering) && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {columns
                  .filter((c) => c.enableFiltering && c.accessorKey)
                  .map((col) => (
                    <div key={col.id} className="flex-1 min-w-[150px]">
                      <input
                        type="text"
                        placeholder={`Filter ${col.header}...`}
                        value={filters[col.id] || ''}
                        onChange={(e) => handleFilterChange(col.id!, e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider',
                    col.enableSorting && sortable && 'cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-slate-700/50',
                    col.size && `w-[${col.size}px]`
                  )}
                  onClick={() => col.enableSorting && sortable && handleSort(col.accessorKey || col.id)}
                  style={{ width: col.size ? `${col.size}px` : undefined }}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.enableSorting && sortable && (
                      <span className="flex flex-col -space-y-1">
                        {sortConfig?.key === col.accessorKey ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-brand-600" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-brand-600" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full"
                    />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Filter className="w-10 h-10 opacity-50" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    className={clsx(
                      'hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.id} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                        {col.cell
                          ? col.cell(col.accessorKey ? row[col.accessorKey] : '', row)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? '')
                          : ''}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  currentPage === 1
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  currentPage === totalPages
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;