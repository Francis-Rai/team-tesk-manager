import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface Props {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export default function DatePicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-50 justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />

          {value ? format(value, "MMM dd, yyyy") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}