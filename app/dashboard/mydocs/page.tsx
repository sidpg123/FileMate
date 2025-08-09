"use client";
import DocCard from '@/components/client/DocCard';
import UploadUserFileForm from '@/components/client/UploadUserFileForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchUserDocuments } from '@/lib/api/user';
import { FileData, PaginatedFilesResponse } from '@/types/api/user.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { File, Plus, Upload } from 'lucide-react';
import React, { useState } from 'react'


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

export default function MyDocs() {

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");

  const debounceSearch = useDebounce(search, 500);
  const debounceYear = useDebounce(year, 500);


  // Define the cursor type

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  // status: queryStatus
} = useInfiniteQuery<PaginatedFilesResponse>({
  queryKey: ["userDocuments", debounceSearch, debounceYear],
  queryFn: ({ pageParam }) =>
    fetchUserDocuments({
      pageParam: pageParam as { uploadedAt: string; id: string } | null,
      search: debounceSearch,
      year: debounceYear,
    }),
  initialPageParam: null,
  refetchOnWindowFocus: false,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
})

  console.log("data", data);
  const allDocs: FileData[] = data?.pages.flatMap((group) => group.data) || [];
  // const allDocs: FileData[] = data?.pages.flatMap((group) => group.data) || [];
  const groupedDocs = groupByYear(allDocs);



  return (
    <div>
      {/* <h1 className="text-2xl font-bold">My Documents</h1>
      <p className="mt-2 text-gray-600">This is where you can manage your documents.</p> */}
      <div className="text-center space-y-4 mt-5">
        <h1 className="text-4xl font-bold text-slate-800">My Documetns</h1>
        <p className="text-slate-600 text-lg">This is where you can manage your documents.</p>
      </div>

      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                placeholder="Search documents..."
              />

              <Input
                onChange={(e) => setYear(e.target.value)}
                className="flex-1 min-w-[150px] h-12 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                placeholder="Filter by year. Eg. 2023-24"
              />
            </div>

            <div className="w-full sm:w-auto mt-4 md:mt-0 flex justify-center">
              {/* <UploadDialog /> */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3 font-semibold flex items-center gap-2 min-w-fit">
                    <Plus className="w-4 h-4" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="space-y-3 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                          Upload New Document
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-base mt-1">
                          Add a new document to your personal file collection. Supported formats include PDF, images, Word documents, Excel sheets, and more.
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="pt-6">
                    <UploadUserFileForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

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
                  showDropdown={true}
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

    </div>
  )
}
