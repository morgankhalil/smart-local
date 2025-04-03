
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from "@/integrations/supabase/types";

interface FiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FiltersDialog = ({ isOpen, onClose }: FiltersDialogProps) => {
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [kinds, setKinds] = useState<Tables<"kinds">[]>([]);
  const [types, setTypes] = useState<Tables<"types">[]>([]);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedKind, setSelectedKind] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("recent");
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        
        if (categoriesData) setCategories(categoriesData);
        
        // Fetch kinds
        const { data: kindsData } = await supabase
          .from("kinds")
          .select("*")
          .order("name");
        
        if (kindsData) setKinds(kindsData);
        
        // Fetch types
        const { data: typesData } = await supabase
          .from("types")
          .select("*")
          .order("name");
        
        if (typesData) setTypes(typesData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    
    if (isOpen) {
      fetchFilterOptions();
    }
  }, [isOpen]);
  
  const handleApplyFilters = () => {
    // Here you would typically apply the filters to a parent component
    // For now, we'll just close the dialog
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Listings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Kind filter */}
          {kinds.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="kind">Kind</Label>
              <Select 
                value={selectedKind} 
                onValueChange={setSelectedKind}
              >
                <SelectTrigger id="kind">
                  <SelectValue placeholder="Select kind" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Kinds</SelectItem>
                  {kinds.map((kind) => (
                    <SelectItem key={kind.id} value={kind.id}>
                      {kind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Type filter */}
          {types.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={selectedType} 
                onValueChange={setSelectedType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Sort order */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <RadioGroup value={sortOrder} onValueChange={setSortOrder}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="recent" />
                <Label htmlFor="recent">Most Recent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credits-low" id="credits-low" />
                <Label htmlFor="credits-low">Credits (Low to High)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credits-high" id="credits-high" />
                <Label htmlFor="credits-high">Credits (High to Low)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;
