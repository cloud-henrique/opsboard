export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';
export type RequestStatus = 'open' | 'in_review' | 'in_progress' | 'waiting_response' | 'resolved' | 'cancelled';
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OperationalRequest {
  id: number;
  title: string;
  description: string;
  status: RequestStatus;
  status_label?: string;
  priority: RequestPriority;
  priority_label?: string;
  category_id: number;
  requester_id: number;
  assignee_id?: number | null;
  due_date?: string | null;
  resolved_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  requester?: User;
  assignee?: User | null;
}

export interface AuditLog {
  id: number;
  auditable_type: string;
  auditable_id: number;
  user_id?: number | null;
  action: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  user?: User | null;
}

export interface DashboardMetrics {
  total_requests: number;
  open_requests: number;
  in_progress_requests: number;
  overdue_requests: number;
  resolved_this_month: number;
  average_resolution_hours: number;
  by_status: MetricBucket[];
  by_priority: MetricBucket[];
}

export interface MetricBucket {
  key: string;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface ResourceResponse<T> {
  data: T;
}

export interface ImportSummary {
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; mêssage: string }[];
}
