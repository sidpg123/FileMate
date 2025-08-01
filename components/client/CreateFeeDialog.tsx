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
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { createFee } from '@/lib/api/fees'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createFee } from '@/lib/api/fees'

interface CreateFeeDialogProps {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateFeeDialog({
  clientId,
  open,
  onOpenChange
}: CreateFeeDialogProps) {
  const [formData, setFormData] = useState({
    amount: '',
    dueDate: '',
    note: '',
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue'
  })

  const queryClient = useQueryClient()

  const createFeeMutation = useMutation({
    mutationFn: createFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees', clientId] })
      queryClient.invalidateQueries({ queryKey: ['client'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
      toast.success('Fee record created successfully!')
      onOpenChange(false)
      setFormData({
        amount: '',
        dueDate: '',
        note: '',
        status: 'Pending'
      })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create fee record')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const submitData = {
      clientId,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      note: formData.note || undefined,
      status: formData.status,
      paymentDate: formData.status === 'Paid' ? new Date().toISOString() : undefined
    }

    createFeeMutation.mutate(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Fee Record</DialogTitle>
          <DialogDescription>
            Add a new fee record for this client. Fill in the required details below.
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
                <SelectItem value="Overdue">Overdue</SelectItem>
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
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              className="bg-green-500 hover:bg-green-600"
            >
              {createFeeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}