"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Phone, DollarSign, IndianRupee } from 'lucide-react'

interface clientCardProps {
    name: string,
    status: string,
    pendingPayment: string | number,
    phoneNumber: string,
    id: string
}

const ClientCard: React.FC<clientCardProps> = ({ 
  name, 
  phoneNumber, 
  status, 
  pendingPayment, 
  id 
}) => {
    const pendingPaymentNumber = Number(pendingPayment)
    const router = useRouter()
    
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString("en-IN")}`
    }

    const isActive = status === 'active'
    const hasPendingPayment = pendingPaymentNumber > 0

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-gray-200">
            {/* Header with name and status */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                        <Phone className="w-4 h-4 mr-1.5" />
                        <span>{phoneNumber}</span>
                    </div>
                </div>
                
                {/* Status badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-600'
                }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Payment section */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                        hasPendingPayment 
                            ? 'bg-orange-100 text-orange-600' 
                            : 'bg-green-100 text-green-600'
                    }`}>
                        <IndianRupee className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {/* {hasPendingPayment ? 'Pending' : 'Paid'} */}
                            Pending
                        </p>
                        <p className="font-semibold text-gray-900">
                            {formatCurrency(pendingPaymentNumber)}
                        </p>
                    </div>
                </div>
                
                {hasPendingPayment && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
            </div>

            {/* Action button */}
            <Button 
                onClick={() => router.push(`/dashboard/client/${id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
                View Details
            </Button>
        </div>
    )
}

export default ClientCard