"use client"
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchClients } from '@/lib/api/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import ClientCard from '../../components/dashboard/ClientCard';


function ListClient() {

  const session = useSession();

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState(""); // 'active' | 'inactive' | ''
  const [feeStatus, setFeeStatus] = useState(""); // 'Pending' | 'Paid' | 'Overdue' | ''
  const [sortBy, setSortBy] = useState("createdAt"); // 'createdAt' | 'name'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(search, 500);


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
  } = useInfiniteQuery({
    queryKey: ["clients", debouncedSearch, status, feeStatus, sortBy, sortOrder],
    queryFn: ({ pageParam = null }) =>
      fetchClients({
        pageParam,
        search,
        status,
        feeStatus,
        sortBy,
        sortOrder,
        accessToken: session.data?.accessToken || ""
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
 
  console.log("data: ", data)

  return (
    <div className='mt-5'>
      <div>

        <div>
          <Input placeholder='Search Client' value={search} onChange={(e) => {
            setSearch(e.target.value);
          }} />
        </div>

        {queryStatus === "pending" && !data && (
          <div className="text-center mt-10">Loading clients...</div>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.pages.flatMap((group) =>
            group.clients.map((client: any) => {

              const pendingAmount = client.fees
                ?.filter((fee: any) => fee.status === "Pending")
                .reduce((sum: number, fee: any) => sum + fee.amount, 0) || 0;
              return (
                <ClientCard
                  key={client.id}
                  name={client.name}
                  id={client.id}
                  email={client.email}
                  phoneNumber={client.phone}
                  pendingPayment={pendingAmount} // pass raw number here
                  status={client.status}
                />
              )

            })
          )}
        </div>



        {hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchNextPage()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </button>
          </div>
        )}


      </div>
    </div>
  )
}

export default ListClient