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
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface Area {
  id: number;
  name: string;
}

interface AreaComboboxProps {
  areas: Area[];
  selectedAreaId: number | null;
  onSelect: (id: number) => void;
  disabled: boolean;
  defaultName?: string;
}

const AreaCombobox = ({
  areas,
  selectedAreaId,
  onSelect,
  disabled,
  defaultName,
}: AreaComboboxProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedArea = areas.find((area) => area.id === selectedAreaId);

  // Hiển thị tên khu vực (ưu tiên từ selectedArea, sau đó là defaultName)
  const displayText = selectedArea
    ? selectedArea.name
    : defaultName || "Chọn khu vực";

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
          disabled={disabled}
        >
          {displayText}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false} loop>
          <CommandInput
            placeholder="Tìm khu vực..."
            className="h-9"
            autoFocus={false}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>Không tìm thấy khu vực.</CommandEmpty>
            <CommandGroup>
              {areas.map((area) => (
                <CommandItem
                  key={area.id}
                  value={area.name}
                  onSelect={() => {
                    onSelect(area.id);
                    setOpen(false);
                  }}
                >
                  {area.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAreaId === area.id ? "opacity-100" : "opacity-0"
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

export default AreaCombobox;
