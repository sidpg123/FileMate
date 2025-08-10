import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Input } from '../ui/input';
import DocCard from '../client/DocCard';
import { fetchClientDocuments } from '@/lib/api/client-dashboard';
import { File } from 'lucide-react';
import { FileData } from '@/types/api/user.types';


const groupByYear = (docs: FileData[]) => {
    const grouped: Record<string, FileData[]> = {};
    docs.forEach(doc => {
        if (!grouped[doc.year]) {
            grouped[doc.year] = [];
        }
        grouped[doc.year].push(doc);
    });
    return grouped;
};



export default function ClientViewDocuments() {

    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");

    const debounceSearch = useDebounce(search, 500);
    const debounceYear = useDebounce(year, 500);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        // status: queryStatus
    } = useInfiniteQuery({
        queryKey: ["documents", debounceSearch, debounceYear],
        queryFn: ({ pageParam = null }) =>
            fetchClientDocuments({
                pageParam,
                search: debounceSearch,
                year: debounceYear,
                // clientId
            }),
        initialPageParam: null,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        // enabled: view === 'documents' // Only fetch documents when documents view is active
    })

    const allDocs = data?.pages.flatMap((group) => group.data) || [];
    const groupedDocs = groupByYear(allDocs);


    return (
        <>
            {/* Search and Upload Section */}
            <div className="container mx-auto px-4 mt-8 mb-8">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                            <Input
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 min-w-[200px] h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                                placeholder="Search documents..."
                                width={100}
                                height={100}
                            />

                            <Input
                                onChange={(e) => setYear(e.target.value)}
                                className="flex-1 min-w-[150px] h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                                placeholder="Filter by year. Eg. 2023-24"
                            />
                        </div>

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
                                    showDropdown={false}
                                    key={doc.id}
                                    fileName={doc.fileName}
                                    thumbnailKey={doc.thumbnailKey!}
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

            {!isFetching && allDocs.length === 0 && (
                <div className="text-center text-gray-500 mt-12 pb-10">
                    <File className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <p className="text-lg">No documents found for this client.</p>
                    {/* <p className="text-sm">Try adjusting your search or upload new documents.</p> */}
                </div>
            )}
        </>
    )
}
