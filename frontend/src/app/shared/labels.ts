import { RequestPriority, RequestStatus, UserRole } from './models';

export const statusLabels: Record<RequestStatus, string> = {
  open: 'Aberta',
  in_review: 'Em análise',
  in_progress: 'Em andamento',
  waiting_response: 'Aguardando retorno',
  resolved: 'Resolvida',
  cancelled: 'Cancelada'
};

export const priorityLabels: Record<RequestPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica'
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador',
  viewer: 'Visualizador'
};

export const auditActionLabels: Record<string, string> = {
  request_created: 'Solicitação criada',
  request_updated: 'Solicitação atualizada',
  status_changed: 'Status alterado',
  priority_changed: 'Prioridade alterada',
  assignee_changed: 'Responsável alterado',
  request_resolved: 'Solicitação resolvida',
  request_cancelled: 'Solicitação cancelada',
  category_created: 'Categoria criada',
  category_updated: 'Categoria atualizada',
  user_created: 'Usuário criado',
  user_updated: 'Usuário atualizado'
};

export function statusClass(status: RequestStatus): string {
  return `status-${status.replace('_', '-')}`;
}

export function priorityClass(priority: RequestPriority): string {
  return `priority-${priority}`;
}
