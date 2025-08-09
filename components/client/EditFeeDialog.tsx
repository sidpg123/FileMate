"use client"

import { updateFee } from '@/lib/api/fees'
import { createFeesCategory, fetchFeesCategories } from '@/lib/api/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import CategorySelector from './SelectCategory'





export default function EditFeeDialog({
  fee,
  open,
  clientId,
  onOpenChange
}: EditFeeDialogProps) {
  
  const [formData, setFormData] = useState({
    amount: '',
    dueDate: '',
    note: '',
    status: 'Pending' as 'Pending' | 'Paid',
    paymentDate: '',
    feeCategory: {
      id: '',
      name: ''
    }
  })

  const queryClient = useQueryClient()

  const { data: feesCategories } = useQuery({
  queryKey: ["feesCategories"],
  queryFn: fetchFeesCategories,
  refetchOnWindowFocus: false
})

  // Initialize form data when fee changes
  useEffect(() => {
    if (fee) {
      setFormData({
        amount: fee.amount.toString(),
        dueDate: fee.dueDate.split('T')[0], // Format date for input
        note: fee.note || '',
        status: fee.status === 'Overdue' ? 'Pending' : fee.status,
        paymentDate: fee.paymentDate ? fee.paymentDate.split('T')[0] : '',
        // feeCategoryId: fee.feeCategoryId || ''
        feeCategory: {
          id: fee.feeCategory?.id || '',
          name: fee.feeCategory?.name || ''
        }
      })
    }
  }, [fee])

  const updateFeeMutation = useMutation({
    mutationFn: updateFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] })
      queryClient.invalidateQueries({ queryKey: ['client'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
      toast.success('Fee record updated successfully!')
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update fee record')
    }
  })

  const createCategoryMutation = useMutation({
    mutationFn: createFeesCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feesCategories'] })
      toast.success('Category created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create category')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const submitData = {
      clientId: clientId, // Add clientId from fee object
      feeId: fee.id,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      note: formData.note || undefined,
      status: formData.status,
      feeCategoryId: formData.feeCategory.id, // Assuming fee object has feeCategoryId
      // Set payment date if status is changed to Paid and there wasn't one before
      paymentDate:
        formData.status === 'Paid'
          ? formData.paymentDate
            ? new Date(formData.paymentDate).toISOString()
            : new Date().toISOString()
          : undefined
    }

    updateFeeMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

const handleCategorySelect = (category: { id: string, name: string }) => {
  setFormData(prev => ({
    ...prev,
    feeCategory: {
      id: category.id,
      name: category.name
    }
  }))
}


  const handleAddCategory = async (name: string): Promise<FeeCategory> => {
    try {
      // Use mutateAsync for easier async handling
      const result = await createCategoryMutation.mutateAsync({ name })

      // If the API returns the created category, use it
      if (result) {
        return result as FeeCategory
      }

      // If API doesn't return the category, refetch and find it
      await queryClient.invalidateQueries({ queryKey: ['feesCategories'] })
      const updatedCategories = queryClient.getQueryData(['feesCategories']) as { data: FeeCategory[] }
      const createdCategory = updatedCategories?.data?.find(cat => cat.name === name)

      if (createdCategory) {
        return createdCategory
      }

      // Fallback: create a temporary category object
      return {
        id: Date.now().toString(), // temporary ID
        name,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: ''
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Fee Record</DialogTitle>
          <DialogDescription>
            Update the fee record details. All fields can be modified.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                {/* <SelectItem value="Overdue">Overdue</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>

            <CategorySelector

              onCategorySelect={handleCategorySelect}
              categories={feesCategories ?? []}
              handleAddCategory={handleAddCategory}
              selectedCategory={formData.feeCategory}
            />

          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add Error additional notes..."
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
            />
          </div>

          {(fee.paymentDate || formData.status === 'Paid') && (
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date </Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
              />
            </div>
          )}


          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateFeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateFeeMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {updateFeeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}