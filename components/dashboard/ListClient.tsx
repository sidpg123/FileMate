"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchClients } from '@/lib/api/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import ClientCard from '../../components/dashboard/ClientCard'
import NewClientDialog from '../NewClientDialog'

function ListClient() {

  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState("") // 'active' | 'inactive' | ''
  const [feeStatus, setFeeStatus] = useState("") // 'Pending' | 'Paid' | 'Overdue' | ''
  const [sortBy, setSortBy] = useState("createdAt") // 'createdAt' | 'name' | 'pendingPayment'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
  } = useInfiniteQuery<TGetClients>({
    queryKey: ["clients", debouncedSearch, status, feeStatus, sortBy, sortOrder],
    queryFn: ({ pageParam }) =>
      fetchClients({
        pageParam: pageParam as { createdAt: string; id: string } | null,
        search: debouncedSearch,
        status,
        feeStatus,
        sortBy,
        sortOrder,
      }),
    initialPageParam: null,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setFeeStatus("")
    setSortBy("createdAt")
    setSortOrder("desc")
  }

  const hasActiveFilters = search || status || feeStatus || sortBy !== "createdAt" || sortOrder !== "desc"

  const totalClients = data?.pages.reduce((acc, page) => acc + page.clients.length, 0) || 0

  return (
    <div className="mt-5 space-y-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          {totalClients > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {totalClients}
            </span>
          )}
        </div>
        <div className="md:hidden">
          <NewClientDialog />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-10"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {[search, status, feeStatus].filter(Boolean).length + (sortBy !== "createdAt" || sortOrder !== "desc" ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Fee Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  value={feeStatus}
                  onChange={(e) => setFeeStatus(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Payments</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>

                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                  <option value="pendingPayment">Pending Payment</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort Order</label>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center gap-2"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <SortAsc className="h-4 w-4" />
                      Ascending
                    </>
                  ) : (
                    <>
                      <SortDesc className="h-4 w-4" />
                      Descending
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters & Clear */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm text-gray-600">Active filters:</span>

                {search && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Search: {search}
                    <button onClick={() => setSearch("")} className="hover:bg-blue-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {status && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Status: {status}
                    <button onClick={() => setStatus("")} className="hover:bg-green-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {feeStatus && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Payment: {feeStatus}
                    <button onClick={() => setFeeStatus("")} className="hover:bg-orange-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {queryStatus === "pending" && !data && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      )}

      {/* No Results */}
      {queryStatus === "success" && totalClients === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No clients found</h3>
          <p className="mt-2 text-gray-500">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Get started by adding your first client"
            }
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Smart Sort Warning */}
      {queryStatus === "success" && feeStatus === "Paid" && sortBy === "pendingPayment" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Sort Not Applicable</h3>
              <p className="text-sm text-yellow-700">
                All filtered clients have $0 pending payment. Consider sorting by name or date instead.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setSortBy("name")}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                >
                  Sort by Name
                </button>
                <button
                  onClick={() => setSortBy("createdAt")}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                >
                  Sort by Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Summary */}
      {queryStatus === "success" && totalClients > 0 && feeStatus === "Pending" && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-900">Clients with Pending Payments</h3>
              <p className="text-sm text-orange-700">
                Showing {totalClients} client{totalClients !== 1 ? 's' : ''} with outstanding payments
              </p>
            </div>
          </div>
        </div>
      )}

      {queryStatus === "success" && totalClients > 0 && feeStatus === "Paid" && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Clients with All Payments Cleared</h3>
              <p className="text-sm text-green-700">
                Showing {totalClients} client{totalClients !== 1 ? 's' : ''} with no pending payments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {queryStatus === "success" && totalClients > 0 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">
            Showing {totalClients} client{totalClients !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
          {isFetching && !isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Updating...
            </div>
          )}
        </div>
      )}

      {/* Client Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {data?.pages.flatMap((group) =>
          group.clients.map((client: Client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              id={client.id}
              phoneNumber={client.phone!}
              pendingPayment={client.pendingFees}
              status={client.status}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="min-w-[140px]"
          >
            {isFetchingNextPage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                Load More
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {totalClients}+
                </span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* End of Results */}
      {queryStatus === "success" && !hasNextPage && totalClients > 0 && (
        <div className="text-center py-6 text-sm text-gray-500 border-t">
          You&apos;ve reached the end of the list
        </div>
      )}
    </div>
  )
}

export default ListClient