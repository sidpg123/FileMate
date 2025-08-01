"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchClientFees, createFee, updateFee } from '@/lib/api/fees'
import CreateFeeDialog from './CreateFeeDialog'
import EditFeeDialog from './EditFeeDialog'
import { Calendar, DollarSign, Edit, FileText, IndianRupee, IndianRupeeIcon, TrendingUp } from 'lucide-react'

type FeeStatus = 'Pending' | 'Paid' | 'Overdue'
type FeeFilter = 'all' | 'pending' | 'paid'

interface Fee {
  id: string
  clientId: string
  amount: number
  dueDate: string
  note?: string
  status: FeeStatus
  createdAt: string
  paymentDate?: string
}

const groupFeesByStatus = (fees: Fee[]) => {
  const grouped: Record<FeeStatus, Fee[]> = {
    Pending: [],
    Paid: [],
    Overdue: []
  }
  
  fees.forEach(fee => {
    grouped[fee.status].push(fee)
  })
  
  return grouped
}

const calculateSummary = (fees: Fee[]) => {
  const summary = {
    totalReceived: 0,
    totalPending: 0,
    totalOverdue: 0,
    totalFees: fees.length
  }
  
  fees.forEach(fee => {
    if (fee.status === 'Paid') {
      summary.totalReceived += fee.amount
    } else if (fee.status === 'Pending') {
      summary.totalPending += fee.amount
    } else if (fee.status === 'Overdue') {
      summary.totalOverdue += fee.amount
    }
  })
  
  return summary
}

const getStatusColor = (status: FeeStatus) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Overdue':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export default function ClientFees({
  clientId
}: {
  clientId: string
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FeeFilter>('all')
  const [editingFee, setEditingFee] = useState<Fee | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const debouncedSearch = useDebounce(search, 500)
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus
  } = useInfiniteQuery({
    queryKey: ["fees", clientId, debouncedSearch, filter],
    queryFn: ({ pageParam = null }) =>
      fetchClientFees({
        pageParam,
        search: debouncedSearch,
        filter,
        clientId
      }),
    initialPageParam: null,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  })

  const allFees = data?.pages.flatMap((group) => group.data) || []
  const groupedFees = groupFeesByStatus(allFees)
  const summary = calculateSummary(allFees)

  const filteredFees = filter === 'all' 
    ? allFees 
    : filter === 'pending' 
      ? [...groupedFees.Pending, ...groupedFees.Overdue]
      : groupedFees.Paid

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-10">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Total Received
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(summary.totalReceived)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">
              Total Pending
            </CardTitle>
            <IndianRupeeIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {formatCurrency(summary.totalPending)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Total Overdue
            </CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(summary.totalOverdue)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Records
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {summary.totalFees}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="container shadow-lg p-3 mb-5 bg-body rounded">
        <div className="flex md:flex-row flex-col gap-3 justify-between items-center">
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500"
          >
            Create New Fee
          </Button>

          <Input 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-2/5 shadow-md shadow-blue-500" 
            placeholder="Search by note or amount..."
          />

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'paid' ? 'default' : 'outline'}
              onClick={() => setFilter('paid')}
              className={filter === 'paid' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              Paid
            </Button>
          </div>
        </div>
      </div>

      {/* Fees Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.map((fee) => (
          <Card key={fee.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-gray-800">
                  {formatCurrency(fee.amount)}
                </CardTitle>
                <Badge className={getStatusColor(fee.status)}>
                  {fee.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Due: {formatDate(fee.dueDate)}</span>
              </div>
              
              {fee.paymentDate && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Calendar className="h-4 w-4" />
                  <span>Paid: {formatDate(fee.paymentDate)}</span>
                </div>
              )}
              
              {fee.note && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Note: </span>
                  {fee.note}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Created: {formatDate(fee.createdAt)}
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFee(fee)}
                  className="w-full hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Fee
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateFeeDialog
        clientId={clientId}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {editingFee && (
        <EditFeeDialog
          fee={editingFee}
          open={!!editingFee}
          onOpenChange={(open) => !open && setEditingFee(null)}
        />
      )}
    </>
  )
}