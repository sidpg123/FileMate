"use client"

import { useDebounce } from '@/hooks/useDebounce'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
// import { fetchClientFees, createFee, updateFee } from '@/lib/api/fees'
// import CreateFeeDialog from './CreateFeeDialog'
// import EditFeeDialog from './EditFeeDialog'
import { fetchClientFees } from '@/lib/api/client-dashboard'
import { Calendar, FileText, IndianRupeeIcon, Search, TrendingUp, X } from 'lucide-react'
// import DeleteFeesDialogue from './DeleteFeesDealogue'


type FeeStatus = 'Pending' | 'Paid' | 'Overdue'
type FeeFilter = 'all' | 'pending' | 'paid'

// interface FeesCategory {
//   id: string
//   name: string
//   description?: string
//   createdAt?: string
//   updatedAt?: string
//   userId?: string
// }
// interface FeesCategoryData {
//   success: string
//   data: FeesCategory[]
// }

interface Fee {
  id: string
  clientId: string
  amount: number
  dueDate: string
  note?: string
  status: FeeStatus
  createdAt: string
  paymentDate?: string
  feeCategoryId: string
  feeCategory?: {
    id: string
    name: string
  }
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

export default function ClientFees() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FeeFilter>('all')
//   const [editingFee, setEditingFee] = useState<Fee | null>(null)
//   const [showCreateDialog, setShowCreateDialog] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState('')

  const debouncedSearch = useDebounce(search, 500)
  // const queryClient = useQueryClient()

//   const { data: feesCategoriesData, isLoading: categoriesLoading } = useQuery<FeesCategoryData>({
//     queryKey: ["feesCategories"],
//     queryFn: fetchFeesCategories,
//     refetchOnWindowFocus: false
//   })

//   const feesCategories = feesCategoriesData?.data;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    isFetchingNextPage,
    // status: queryStatus
  } = useInfiniteQuery({
    queryKey: ["fees", debouncedSearch, filter],
    queryFn: ({ pageParam }) =>
      fetchClientFees({
        pageParam,
        search: debouncedSearch,
        filter,
      }),
    initialPageParam: null,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    }
  })
  // //console.log("Fees Categories Data: ", feesCategories)
  const allFees = data?.pages.flatMap((group) => group.data) || []
  const groupedFees = groupFeesByStatus(allFees)
  const summary = calculateSummary(allFees)

//   const getCategoryName = (categoryId: string) => {
//     return feesCategories?.find(cat => cat.id === categoryId)?.name || 'Unknown Category'
//   }

  const clearFilters = () => {
    setSearch('')
    setFilter('all')
    // setSelectedCategory('')
  }

  const hasActiveFilters = search || filter !== 'all' 

  const filteredFees = filter === 'all'
    ? allFees
    : filter === 'pending'
      ? [...groupedFees.Pending, ...groupedFees.Overdue]
      : groupedFees.Paid

  //console.log("Fees  Data: ", filteredFees)
  return (
    <div className=" space-y-6 pb-8">
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
      <Card className="border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Top Row - Create Button and Active Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <IndianRupeeIcon className="h-4 w-4 mr-2" />
                Create New Fee
              </Button> */}

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Filters active:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-3 text-xs hover:bg-slate-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Second Row - Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 shadow-sm border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Search by note, amount..."
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Category Filter */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`min-w-[160px] justify-between shadow-sm border-slate-200 hover:bg-slate-50 ${selectedCategory ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {selectedCategory
                        ? getCategoryName(selectedCategory)
                        : 'All Categories'
                      }
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory('')}
                    className={selectedCategory === '' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categoriesLoading ? (
                    <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
                  ) : (
                    feesCategories?.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : ''}
                      >
                        {category.name}
                        {category.description && (
                          <span className="text-xs text-slate-500 ml-2">
                            ({category.description})
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* Status Filter Buttons */}
              <div className="flex gap-2 items-center justify-center">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={`transition-all duration-200 px-5 ${filter === 'all'
                    ? 'bg-slate-800 hover:bg-slate-900 shadow-md'
                    : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  className={`transition-all duration-200 px-5 ${filter === 'pending'
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-md'
                    : 'hover:bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'paid' ? 'default' : 'outline'}
                  onClick={() => setFilter('paid')}
                  className={`transition-all duration-200 px-5 ${filter === 'paid'
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md'
                    : 'hover:bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  size="sm"
                >
                  Paid
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees Cards */}
      {filteredFees.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No fees found</h3>
            <p className="text-slate-500 text-center">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms"
                : "Create your first fee to get started"
              }
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFees.map((fee) => (
            <Card
              key={fee.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      {formatCurrency(fee.amount)}
                    </CardTitle>

                    {fee.feeCategory && (
                      <p className="text-sm text-slate-600 mt-1">
                        {/* {getCategoryName(fee.feeCategory.id)} */}
                        Category: {fee.feeCategory.name}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge className={getStatusColor(fee.status)}>
                      {fee.status}
                    </Badge>
                    {/* <DeleteFeesDialogue 
                      feeId={fee.id}
                       clientId={clientId}
                    /> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 mt-2 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(fee.dueDate)}</span>
                  </div>
                </div>

                {fee.paymentDate && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span>Paid: {formatDate(fee.paymentDate)}</span>
                  </div>
                )}

                {fee.note && (
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <span className="font-medium">Note: </span>
                    {fee.note}
                  </div>
                )}

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Created: {formatDate(fee.createdAt)}
                </div>

                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFee(fee)}
                  className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Fee
                </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Load More */}
      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="bg-white hover:bg-slate-50 shadow-lg border-slate-200"
          >
            {isFetchingNextPage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800 mr-2"></div>
                Loading more...
              </>
            ) : (
              "Load More Fees"
            )}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {/* {showCreateDialog && (
        <CreateFeeDialog
          clientId={clientId}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}


      {editingFee && (
        <EditFeeDialog
          clientId={clientId}
          fee={editingFee}
          open={!!editingFee}
          onOpenChange={(open) => !open && setEditingFee(null)}
        />
      )} */}
    </div>
  )
}