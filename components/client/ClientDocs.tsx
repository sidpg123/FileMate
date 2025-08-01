"use client"

import { useDebounce } from '@/hooks/useDebounce'
import { fetchClientDocuments } from '@/lib/api/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '../ui/input'
import ClientFees from './ClientFees'
import DocCard from './DocCard'
import UploadDialog from './UploadDialog'

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
    view
}: {
    clientId: string;
    view: 'documents' | 'payments';
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
        queryFn: ({ pageParam = null }) =>
            fetchClientDocuments({
                pageParam,
                search: debounceSearch,
                year,
                clientId
            }),
        initialPageParam: null,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        enabled: view === 'documents' // Only fetch documents when documents view is active
    })

    const allDocs = data?.pages.flatMap((group) => group.data) || [];
    const groupedDocs = groupByYear(allDocs);

    return (
        <>
            {view === 'payments' ? (
                <ClientFees clientId={clientId} />
            ) : (
                <>
                    {/* Enhanced Search and Upload Section */}
                    <div className='container mx-auto px-4 mt-8 mb-8'>
                        <div className='bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6'>
                            <div className='flex md:flex-row flex-col gap-4 justify-between items-center'>
                                <div className="relative flex-1 max-w-md">
                                    <Input 
                                        onChange={(e) => setSearch(e.target.value)} 
                                        className='w-full h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm' 
                                        placeholder='Search documents...' 
                                    />
                                </div>
                                <UploadDialog />
                            </div>
                        </div>
                    </div>

                    {/* Documents Grid with Improved Layout */}
                    <div className="container mx-auto px-4 space-y-12">
                        {Object.entries(groupedDocs).map(([year, docs]) => (
                            <div key={year} className="space-y-6">
                                {/* Year Header with Modern Design */}
                                <div className='flex items-center gap-4'>
                                    <div className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg'>
                                        <h2 className="text-xl font-bold">{year}</h2>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {docs.length} document{docs.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                
                                {/* Documents Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {docs.map((doc) => (
                                        <DocCard
                                            key={doc.id}
                                            fileName={doc.fileName}
                                            thumbnailKey={doc.thumbnailKey}
                                            fileKey={doc.fileKey}
                                            year={year}
                                            fileId={doc.id} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button with Better Styling */}
                    {hasNextPage && (
                        <div className="mt-12 text-center pb-8">
                            <button
                                onClick={() => fetchNextPage()}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? "Loading more..." : "Load More Documents"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    )
}