import { Activity, BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 relative overflow-hidden">
      {/* Blurred Background Content */}
      <div className="blur-sm opacity-30 pointer-events-none">
        {/* Header Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Active Clients</p>
                <p className="text-lg md:text-2xl font-bold">247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Revenue</p>
                <p className="text-lg md:text-2xl font-bold">₹12.4L</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Growth</p>
                <p className="text-lg md:text-2xl font-bold">+24%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Pending</p>
                <p className="text-lg md:text-2xl font-bold">₹3.2L</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              <h3 className="text-base md:text-lg font-semibold">Revenue Trends</h3>
            </div>
            <div className="h-32 md:h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-around p-4">
              {[40, 65, 35, 80, 45, 70, 90].map((height, i) => (
                <div
                  key={i}
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${height}%`, width: '12%' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Top Clients */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="text-base md:text-lg font-semibold mb-4">Top Clients</h3>
            <div className="space-y-2 md:space-y-3">
              {['Sharma Industries', 'Tech Solutions'].map((client, i) => (
                <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm md:text-base text-gray-700">{client}</span>
                  <span className="text-sm md:text-base font-semibold text-green-600">₹{(Math.random() * 100 + 50).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Defaulters */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <h3 className="text-base md:text-lg font-semibold mb-4">Defaulters</h3>
            <div className="space-y-2 md:space-y-3">
              {['ABC Traders', 'Quick Services'].map((client, i) => (
                <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                  <span className="text-sm md:text-base text-gray-700">{client}</span>
                  <span className="text-sm md:text-base font-semibold text-red-600">₹{(Math.random() * 50 + 20).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4">
        <div className="text-center max-w-sm md:max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
            <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Analytics Dashboard
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Coming Soon
          </p>
          
          <p className="text-sm md:text-base text-gray-500 leading-relaxed px-2">
            We&apos;re building something amazing for you. Get ready to dive deep into your business insights.
          </p>
          
          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}