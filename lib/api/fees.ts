// lib/api/fees.ts
// Updated to use axios instead of fetch

import { axiosClient } from "../utils"

// import { axiosClient } from './axiosClient'; // Adjust import path as needed

interface FetchClientFeesParams {
  pageParam?: {
    cursorId?: string
    cursorCreatedAt?: string
  } | null
  search: string
  filter: 'all' | 'pending' | 'paid'
  clientId: string,
  feeCategoryId?: string // Optional for filtering by category
}

interface CreateFeeData {
  clientId: string
  amount: number
  dueDate: string
  note?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
  feeCategoryId?: string
}

interface UpdateFeeData {
  clientId: string
  feeId: string
  amount: number
  dueDate: string
  note?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
  feeCategoryId: string
}

export const fetchClientFees = async ({
  pageParam,
  search,
  filter,
  clientId,
  feeCategoryId
}: FetchClientFeesParams) => {
  const params: Record<string, string> = {
    limit: '10'
  };

  if (pageParam?.cursorId && pageParam?.cursorCreatedAt) {
    params.cursorId = pageParam.cursorId;
    params.cursorCreatedAt = pageParam.cursorCreatedAt;
  }

  if (search) params.search = search;
  if (feeCategoryId) params.feeCategoryId = feeCategoryId;
  if (clientId) params.clientId = clientId;
  if (filter && filter !== 'all') params.status = filter;

  const res = await axiosClient.get(`/clients/${clientId}/fees`, { params });

  return {
    data: res.data.data || [],
    nextCursor: res.data.nextCursor || null,
    hasMore: res.data.hasMore || false,
    summary: res.data.summary || null
  };
};

export const createFee = async (data: CreateFeeData) => {
  console.log("Creating Fee with data:", data)
  const res = await axiosClient.post(`/clients/${data.clientId}/fees`, {
    amount: data.amount,
    dueDate: data.dueDate,
    note: data.note,
    status: data.status,
    paymentDate: data.paymentDate,
    feeCategoryId: data.feeCategoryId
  })

  return res.data.feeRecord || res.data.data
}

export const updateFee = async (data: UpdateFeeData) => {
  const res = await axiosClient.put(`/clients/${data.clientId}/fees/${data.feeId}`, {
    amount: data.amount,
    dueDate: data.dueDate,
    note: data.note,
    status: data.status,
    paymentDate: data.paymentDate,
    feeCategoryId: data.feeCategoryId
  })

  return res.data.feeRecord || res.data.data
}

export const deleteFee = async ({ clientId, feeId }: { clientId: string; feeId: string }) => {
  const res = await axiosClient.delete(`/clients/${clientId}/fees/${feeId}`)
  return res.data
}


export const getFeeStatistics = async (clientId: string) => {
  const res = await axiosClient.get(`/clients/${clientId}/fees/statistics`)
  return res.data.statistics
}