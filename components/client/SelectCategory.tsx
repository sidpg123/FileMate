"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Plus, Check } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
}

interface CategorySelectorProps {
    onCategorySelect: (category: Category) => void
    categories?: { data: Category[] }
    handleAddCategory: (name: string) => Promise<Category>
    selectedCategory?: Category | null
}

export default function CategorySelector({
    onCategorySelect,
    categories,
    handleAddCategory,
    selectedCategory: externalSelectedCategory,
}: CategorySelectorProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        externalSelectedCategory || null
    )
    const [newCategory, setNewCategory] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Update internal state when external selection changes
    useEffect(() => {
        setSelectedCategory(externalSelectedCategory || null)
    }, [externalSelectedCategory])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSelectCategory = (category: Category) => {
        console.log("Selecting category:", category)
        setSelectedCategory(category)
        onCategorySelect(category)
        setOpen(false)
        setSearchTerm("")
    }

    const handleAddCategoryClick = async () => {
        if (!newCategory.trim()) return
        
        try {
            setLoading(true)
            console.log("Adding new category:", newCategory.trim())
            const created = await handleAddCategory(newCategory.trim())
            console.log("Created category:", created)
            handleSelectCategory(created)
            setNewCategory("")
        } catch (err) {
            console.error("Error adding category:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newCategory.trim()) {
            e.preventDefault()
            handleAddCategoryClick()
        }
    }

    const currentSelectedCategory = externalSelectedCategory || selectedCategory

    // Filter categories based on search term
    const filteredCategories = categories?.data?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <Button
                variant="outline"
                className="w-full justify-between"
                type="button"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpen(!open)
                }}
            >
                {currentSelectedCategory?.name || "Select a category"}
                <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
            </Button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Categories List */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors",
                                        currentSelectedCategory?.id === category.id && "bg-blue-50 text-blue-900"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log("Category clicked:", category)
                                        handleSelectCategory(category)
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                    }}
                                >
                                    <span>{category.name}</span>
                                    {currentSelectedCategory?.id === category.id && (
                                        <Check className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                            ))
                        ) : searchTerm ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                No categories found for &quot;{searchTerm}&quot;

                            </div>
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                No categories available
                            </div>
                        )}
                    </div>

                    {/* Add New Category */}
                    <div className="border-t p-2 bg-gray-50">
                        <div className="flex gap-2">
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add new category..."
                                className="flex-1 h-8"
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleAddCategoryClick()
                                }}
                                size="sm" 
                                variant="ghost"
                                disabled={loading || !newCategory.trim()}
                                type="button"
                            >
                                {loading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}