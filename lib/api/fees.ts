// lib/api/fees.ts
// Updated to use axios instead of fetch

import { axiosClient } from "../utils"

// import { axiosClient } from './axiosClient'; // Adjust import path as needed

interface FetchClientFeesParams {
  pageParam: string | null
  search: string
  filter: 'all' | 'pending' | 'paid'
  clientId: string
}

interface CreateFeeData {
  clientId: string
  amount: number
  dueDate: string
  note?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
}

interface UpdateFeeData {
  clientId: string
  feeId: string
  amount: number
  dueDate: string
  note?: string
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
}

export const fetchClientFees = async ({
  pageParam,
  search,
  filter,
  clientId
}: FetchClientFeesParams) => {
  const params: Record<string, string> = {
    limit: '10'
  }
  
  if (pageParam) params.cursor = pageParam
  if (search) params.search = search
  if (filter && filter !== 'all') params.status = filter

  const res = await axiosClient.get(`/clients/${clientId}/fees`, {
    params
  })
  
  // Transform response to match expected format
  return {
    data: res.data.feeRecord || res.data.data || [],
    nextCursor: res.data.nextCursor,
    hasMore: res.data.hasMore,
    summary: res.data.summary
  }
}

export const createFee = async (data: CreateFeeData) => {
  const res = await axiosClient.post(`/clients/${data.clientId}/fees`, {
    amount: data.amount,
    dueDate: data.dueDate,
    note: data.note,
    status: data.status,
    paymentDate: data.paymentDate
  })

  return res.data.feeRecord || res.data.data
}

export const updateFee = async (data: UpdateFeeData) => {
  const res = await axiosClient.put(`/clients/${data.clientId}/fees/${data.feeId}`, {
    amount: data.amount,
    dueDate: data.dueDate,
    note: data.note,
    status: data.status,
    paymentDate: data.paymentDate
  })

  return res.data.feeRecord || res.data.data
}

export const deleteFee = async (clientId: string, feeId: string) => {
  const res = await axiosClient.delete(`/clients/${clientId}/fees/${feeId}`)
  return res.data
}

export const getFeeStatistics = async (clientId: string) => {
  const res = await axiosClient.get(`/clients/${clientId}/fees/statistics`)
  return res.data.statistics
}