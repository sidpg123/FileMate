"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Tag } from 'lucide-react'
import { createFee } from '@/lib/api/fees'
import { fetchFeesCategories, createFeesCategory } from '@/lib/api/user'
import CategorySelector from './SelectCategory'
import React from 'react'

interface CreateFeeDialogProps {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FeeCategory {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
  userId?: string
}

function CreateFeeDialog({
  clientId,
  open,
  onOpenChange
}: CreateFeeDialogProps) {

  //console.log("rendering")

  const [formData, setFormData] = useState({
    amount: '',
    dueDate: '',
    note: '',
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
    categoryId: ''
  })

  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null)

  const queryClient = useQueryClient()

  const { data: feesCategories } = useQuery({
    queryKey: ["feesCategories"],
    queryFn: fetchFeesCategories,
    refetchOnWindowFocus: false
  })

  //console.log("Fees Categories: ", feesCategories)

  const createFeeMutation = useMutation({
    mutationFn: createFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees', clientId] })
      queryClient.invalidateQueries({ queryKey: ['client'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
      toast.success('Fee record created successfully!')
      onOpenChange(false)
      resetForm()
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create fee record')
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

  const resetForm = () => {
    setFormData({
      amount: '',
      dueDate: '',
      note: '',
      status: 'Pending',
      categoryId: ''
    })
    setSelectedCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.dueDate || !formData.categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    const submitData = {
      clientId,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      note: formData.note || undefined,
      status: formData.status,
      feeCategoryId: formData.categoryId,
      paymentDate: formData.status === 'Paid' ? new Date().toISOString() : undefined
    }
    //console.log("Submitting Fee Data: ", submitData)
    createFeeMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategorySelect = (category: FeeCategory) => {
    //console.log("Selected Category in dialog:", category)
    //console.log("Selected Category id in dialog:", category.id)
    setSelectedCategory(category)
    handleInputChange('categoryId', category.id)
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
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Create New Fee Record
          </DialogTitle>
          <DialogDescription>
            Add a new fee record for this client. Fill in the required details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
                className="text-right"
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
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            
            <CategorySelector
              onCategorySelect={handleCategorySelect}
              categories={feesCategories}
              handleAddCategory={handleAddCategory}
              selectedCategory={selectedCategory}
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
                <SelectItem value="Pending">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="Paid">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Paid
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes..."
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createFeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createFeeMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createFeeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Fee Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(CreateFeeDialog)