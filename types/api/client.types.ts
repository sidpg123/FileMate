
interface Fee {
  id: string
  clientId: string
  amount: number
  dueDate: string
  note?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  createdAt: string
  paymentDate?: string
  feeCategoryId: string
  feeCategory?: {
    id: string
    name: string
  }
}

interface FeeCategory {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
  userId?: string
}

interface EditFeeDialogProps {
  fee: Fee
  open: boolean
  clientId: string
  onOpenChange: (open: boolean) => void
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  pendingFees: number;
  createdAt: Date;
  storageUsed?: number
}

interface TGetClients {
  success: boolean;
  nextCursor: {
    createdAt: Date;
    id: string;
  } | undefined,
  totalPendingFees: number;
  meta: {
    sortBy: string | undefined;
    sortOrder: "asc" | "desc";
    feesStatusFilter: string | undefined;
    hasFilters: boolean;
    sortWarning: string | null;
  };
  clients: Client[]

}