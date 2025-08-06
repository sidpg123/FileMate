"use client";
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'

export default function MyDocs() {

      const [search, setSearch] = useState("");
      const [year, setYear] = useState("");
  

  return (
    <div>
      <h1 className="text-2xl font-bold">My Documents</h1>
      <p className="mt-2 text-gray-600">This is where you can manage your documents.</p>


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
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
