export default async function page() {
  // const session = await auth()
  //console.log(session)
  //console.log(session?.user.id)
  
  return (
    
    <div className="relative bg-white/90 shadow-lg rounded-xl p-6 w-full max-w-lg border border-gray-200 backdrop-blur-md hover:shadow-xl transition flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">

      {/* Left: Name & ID */}
      <div className="flex flex-col text-center sm:text-left">
        <h2 className="text-2xl font-semibold text-gray-900">Ayush Sanjay Kadam</h2>
        <p className="text-sm text-gray-500 mt-1 tracking-wide">ID: HFJPP881P</p>
      </div>

      {/* Right: Payment Status & Action */}
      <div className="flex flex-col items-center sm:items-end space-y-2">

        {/* Payment Badge */}
        <span className="bg-red-100 text-red-600 text-sm font-medium px-4 py-1 rounded-full shadow-sm">
          🚨 Payment Pending: ₹2,500
        </span>

        {/* Duration */}
        <p className="text-sm text-gray-600">📅 2019 - 2025</p>

        {/* Action Button */}
        <button className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md">
          Open
        </button>
      </div>

    </div>


  );
}
