"use client"
// import React from 'react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import UploadDialog from './UploadDialog'
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchClientDocuments } from '@/lib/api/client'
import DocCard from './DocCard'

const groupByYear = (docs: any[]) => {
    const grouped: Record<string, any[]> = {};
    docs.forEach(doc => {
        if (!grouped[doc.year]) {
            grouped[doc.year] = [];
        }
        grouped[doc.year].push(doc);
    });
    return grouped;
};


export default function ClientDocs({
    clientId,
    // accessToken,
}: {
    clientId: string;
    // accessToken: string;
}) {
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");

    const debounceSearch = useDebounce(search, 500);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status: queryStatus
    } = useInfiniteQuery({
        queryKey: ["documents", clientId, debounceSearch, year],
        // staleTime: 1000 * 60 * 10,
        queryFn: ({ pageParam = null }) =>
            fetchClientDocuments({
                pageParam,
                search: debounceSearch,
                year,
                clientId
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
    })

    console.log("Data of Documents: ", data);
    const allDocs = data?.pages.flatMap((group) => group.data) || [];
    const groupedDocs = groupByYear(allDocs);

    return (
        <>
            <div className='container shadow-lg p-3 mt-14 mb-5 bg-body rounded'>
                <div className='flex md:flex-row flex-col gap-3 justify-between items-center'>
                    <Button className='bg-blue-500 text-white hover:bg-blue-600 text-wrap  shadow-lg shadow-blue-500'>
                        Fees Summry
                    </Button>

                    <Input onChange={(e) => {
                        setSearch(e.target.value);
                    }} className='w-full md:w-2/5 shadow-md shadow-blue-500' placeholder='Enter document name' />

                    <UploadDialog />
                </div>
            </div>
            <div className="space-y-8">
                {Object.entries(groupedDocs).map(([year, docs]) => (
                    <div key={year}>
                        <h2 className="text-xl font-bold mb-3 text-blue-600">{year}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {docs.map((doc) => (
                                <DocCard
                                    key={doc.id}
                                    fileName={doc.fileName}
                                    thumbnailKey={doc.thumbnailKey}
                                    fileKey={doc.fileKey}
                                />
                            ))}
                        </div>
                    </div>
                ))}
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

        </>

    )
}



