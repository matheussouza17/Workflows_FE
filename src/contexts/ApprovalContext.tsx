import { createContext, ReactNode, useState, useCallback } from 'react';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

type Approval = {
  id: number;
  number: string;
  name: string;
  categoryId: number;
  description?: string;
  value: number;
  createdById: number;
};

type Process = {
  id: number;
  status: string;
};

type ProcessLog = {
  id: number;
  processId: number;
  action: string;
  timestamp: string;
  user: {
    name: string;
  };
  description?: string;
};

type ApprovalContextData = {
  approvals: Approval[];
  approval: Approval | null;
  process: Process | null;
  processLogs: ProcessLog[];
  loading: boolean;
  fetchApprovals: () => Promise<void>;
  fetchApprovalById: (id: number) => Promise<void>;
  fetchProcessLogs: (processId: number) => Promise<void>;
  handleAction: (action: string, processId: number) => Promise<void>;
  createApproval: (data: Omit<Approval, 'id' | 'createdById'>) => Promise<void>;
};

type ApprovalProviderProps = {
  children: ReactNode;
};

export const ApprovalContext = createContext({} as ApprovalContextData);

export function ApprovalProvider({ children }: ApprovalProviderProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [approval, setApproval] = useState<Approval | null>(null);
  const [process, setProcess] = useState<Process | null>(null);
  const [processLogs, setProcessLogs] = useState<ProcessLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all approvals
  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/approvals');
      setApprovals(response.data);
    } catch (error) {
      console.error('Erro ao buscar aprovações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch approval details by ID
  async function fetchApprovalById(id: number) {
    setLoading(true);
    try {
      const response = await api.get(`/approval/${id}`);
      setApproval(response.data.approval);
      setProcess(response.data.process);
    } catch (error) {
      toast.error("Erro ao buscar detalhes da aprovação");
    } finally {
      setLoading(false);
    }
  }

  // Fetch process logs (history)
  async function fetchProcessLogs(processId: number) {
    setLoading(true);
    try {
      const response = await api.get(`/activity-log/${processId}`); // Busca o histórico pela rota correta
      setProcessLogs(response.data);
    } catch (error) {
      toast.error("Erro ao buscar histórico do processo");
    } finally {
      setLoading(false);
    }
  }

  // Handle actions: approve, reject, cancel
  async function handleAction(action: string, processId: number) {
    try {
      await api.put(`/process/${processId}`, {
        action: action,
        approvalId: approval?.id
      });
      toast.success(`Aprovação ${action} com sucesso!`);
    } catch (error) {
      toast.error("Erro ao executar a ação");
    }
  }

  // Create a new approval
  async function createApproval(data: Omit<Approval, 'id' | 'createdById'>) {
    setLoading(true);
    try {
      await api.post('/approval', data);
      await fetchApprovals(); // Atualiza a lista de aprovações após a criação
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <ApprovalContext.Provider
      value={{
        approvals,
        approval,
        process,
        processLogs,
        loading,
        fetchApprovals,
        fetchApprovalById,
        fetchProcessLogs,
        handleAction,
        createApproval,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
}