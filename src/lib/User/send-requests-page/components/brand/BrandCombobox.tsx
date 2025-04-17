import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

const BrandCombobox = ({ brands, selectedBrand, onSelect, newlyCreatedBrand = null }) => {
  const [open, setOpen] = React.useState(false);
  
  // Filter brands to only show status=1 plus the newly created brand if it exists
  const filteredBrands = React.useMemo(() => {
    const statusOneBrands = brands.filter(brand => brand.status === 1);
    
    // Include newly created brand if it exists
    if (newlyCreatedBrand) {
      return [...statusOneBrands, newlyCreatedBrand];
    }
    
    return statusOneBrands;
  }, [brands, newlyCreatedBrand]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              "focus-visible:ring-orange-400 focus-visible:ring-offset-0"
            )}
          >
            {selectedBrand
              ? filteredBrands.find((brand) => brand.name === selectedBrand)?.name ||
                selectedBrand
              : "Chọn thương hiệu..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Tìm kiếm thương hiệu..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>
              <CommandGroup>
                {filteredBrands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.name}
                    onSelect={() => {
                      onSelect(brand);
                      setOpen(false);
                    }}
                  >
                    {brand.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBrand === brand.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BrandCombobox;