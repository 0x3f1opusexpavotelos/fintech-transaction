import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const options = ["amount", "payee", "date"]

type Props = {
  selectedColumns: string[]
  columnIndex: number
  onChange: (columnIndex: number, value: string) => void
}
export const TableHeadSelect = ({
  selectedColumns,
  columnIndex,
  onChange
}: Props) => {
  const currentSelection = selectedColumns[columnIndex]

  return (
    <Select
      value={currentSelection}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelection !== "skip" && "text-blue-500"
        )}
      >
        <SelectValue placeholder="skip"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const selectedIdx = selectedColumns.indexOf(option)

          const disabled =
            selectedColumns.includes(option) && columnIndex !== selectedIdx

          return (
            <SelectItem
              key={index}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
