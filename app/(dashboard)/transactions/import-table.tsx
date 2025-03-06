import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TableHeadSelect } from "./table-head-select"

type Props = {
  headers: string[]
  body: string[][]
  selectedColumns: string[]
  onTableHeadSelectChange: (colIndex: number, value: string) => void
}

export const ImportTable = ({
  headers,
  selectedColumns,
  onTableHeadSelectChange,
  body
}: Props) => {
  return (
    <div className="rounded-m border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((col, index) => (
              <TableHead key={index}>
                <TableHeadSelect
                  onChange={onTableHeadSelectChange}
                  selectedColumns={selectedColumns}
                  columnIndex={index}
                ></TableHeadSelect>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {body.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
