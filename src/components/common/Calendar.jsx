"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarUI({
  label = "Booking date",
  selected,
  onSelect,
  minDate,
}) {
  const [open, setOpen] = React.useState(false)

  // Convert string (yyyy-mm-dd) → Date
  const selectedDate = selected ? new Date(selected) : undefined

  return (
    <div className="flex flex-col gap-3 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-between font-normal bg-transparent shadow-none rounded-lg border-gray-300"
          >
            {selectedDate
              ? selectedDate.toLocaleDateString()
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full overflow-hidden p-0" align="start">
          <Calendar
            className="w-full"
            mode="single"
            selected={selectedDate}
            fromDate={minDate}
            onSelect={(date) => {
              if (!date) return
              onSelect(
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
              )
              setOpen(false)
            }}
            classNames={{
              day_selected: "bg-indigo-600 text-white",
              day_today: "border-indigo-300 text-indigo-600"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
