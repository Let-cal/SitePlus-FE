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
import { Check, ChevronDown, Loader2 } from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface District {
  id: number;
  name: string;
}

interface DistrictComboboxProps {
  districts: District[];
  selectedDistrictId: number | null;
  onSelect: (id: number) => void;
  isDataLoaded: boolean;
  defaultName?: string;
}

const DistrictCombobox = ({
  districts,
  selectedDistrictId,
  onSelect,
  isDataLoaded,
  defaultName,
}: DistrictComboboxProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedDistrict = districts.find(
    (district) => district.id === selectedDistrictId
  );

  // Hiển thị tên quận/huyện (ưu tiên từ selectedDistrict, sau đó là defaultName)
  const displayText = selectedDistrict
    ? selectedDistrict.name
    : defaultName || "Chọn quận/huyện";

  // Đảm bảo focus quay lại trigger khi đóng Popover
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {!isDataLoaded ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải...
            </div>
          ) : (
            displayText
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false} loop>
          <CommandInput
            placeholder="Tìm quận/huyện..."
            className="h-9"
            autoFocus={false}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>Không tìm thấy quận/huyện.</CommandEmpty>
            <CommandGroup>
              {districts.map((district) => (
                <CommandItem
                  key={district.id}
                  value={district.name}
                  onSelect={() => {
                    onSelect(district.id);
                    setOpen(false);
                  }}
                >
                  {district.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedDistrictId === district.id
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
  );
};

export default DistrictCombobox;
