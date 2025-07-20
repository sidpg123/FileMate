import ClientDocs from '@/components/client/ClientDocs'
import React from 'react'

export default function page() {
  const data: any = [
    {
      fileName: 'ITR.pdf',
      thumbnailURL: 'https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/upload_preset_advanced.png',
    },
    {
      fileName: 'Balance Sheet.pdf',
      thumbnailURL: 'https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/upload_preset_advanced.png',
    },
    {
      fileName: 'ITR.pdf',
      thumbnailURL: 'https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/upload_preset_advanced.png',
    },
    {
      fileName: 'ITR2.pdf',
      thumbnailURL: 'https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/upload_preset_advanced.png',
    },
    {
      fileName: 'ITR3.pdf',
      thumbnailURL: 'https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/upload_preset_advanced.png',
    },
  ]

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {data.map((element: any, index: number) => (
          <div
            key={`${element.fileName}-${index}`}
            className=' group border border-slate-300 rounded-lg overflow-hidden'
          >
            {/* File Name */}
            <div className='w-full bg-slate-500 text-white p-2 rounded-t-lg'>
              {element.fileName}
            </div>

            {/* Thumbnail */}
            <div className='relative'>
              <img src={element.thumbnailURL} alt='thumbnail' className='w-full' />


              {/* Hover Actions */}
              <div className='absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <a
                  href={element.thumbnailURL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white text-black px-3 py-1 rounded hover:bg-gray-100'
                >
                  Open
                </a>
                <a
                  href={element.thumbnailURL}
                  download={element.fileName}
                  className='bg-white text-black px-3 py-1 rounded hover:bg-gray-100'
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
