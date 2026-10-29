// TypeScript types for island components

export interface AnimatedStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export interface DashboardChartsProps {
  data: Array<{ name: string; [key: string]: number | string }>;
  lines: Array<{ key: string; color: string; name: string }>;
  className?: string;
  height?: number;
}

export interface LogEntryFormProps {
  onSubmit: (data: { title: string; content: string; hours: number; date: string }) => Promise<void>;
  initialData?: { title: string; content: string; hours: number; date: string };
  className?: string;
}

export interface InternshipProgressProps {
  progress: number;
  totalHours: number;
  completedHours: number;
  currentPhase: string;
  phases: Array<{ name: string; progress: number; color: string }>;
  className?: string;
}

export interface SearchCommandProps {
  items: Array<{
    id: string;
    label: string;
    description?: string;
    shortcut?: string;
    icon?: React.ReactNode;
    action: () => void;
    section?: string;
    keywords?: string[];
  }>;
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  columns: Array<{
    id: string;
    header: string;
    accessorKey?: keyof T;
    cell?: (info: { getValue: () => unknown; row: { original: T } }) => React.ReactNode;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    filterFn?: 'auto' | 'startsWith' | 'endsWith' | 'includes';
    size?: number;
  }>;
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

export interface SidebarProps {
  user?: { name: string; role: string; avatar?: string };
  navigation: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
    children?: Array<{
      label: string;
      href: string;
      icon: React.ReactNode;
    }>;
    roles?: string[];
  }>;
  className?: string;
  defaultOpen?: boolean;
}
