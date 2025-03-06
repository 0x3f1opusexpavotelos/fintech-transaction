"use client"

import { useState } from "react"
import { ImportTable } from "@/app/(dashboard)/transactions/import-table"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

import { transactions as transactionsSchema } from "@/db/schema"
import { convertAmountToMiliunits } from "@/lib/utils"
import { parse } from "date-fns"

const InputFormat = "yyyy-MM-dd HH:mm:ss"
// const OutputFormat = "yyyy-MM-dd"
const RequiresColumns = ["amount", "date", "payee"]

// overwirte/remap  existing data field
type ApiFromValues = Omit<typeof transactionsSchema.$inferInsert, "date"> & {
  date: string
}

type Props = {
  data: string[][]
  onCancel: () => void
  onSubmit: (values: (typeof transactionsSchema.$inferInsert)[]) => void
}

export const ImportCard = ({ onCancel, data, onSubmit }: Props) => {
  const [headers, ...body] = data

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    new Array(headers.length).fill("skip")
  )

  const isEnable = RequiresColumns.every((col) => selectedColumns.includes(col))

  const progress = selectedColumns.filter((col) => col !== "skip").length
  // const [missingColumns, setMissingColumns] = useState<string[]>([])
  // const validateSelection = () => {
  //   const missing = RequiresColumns.filter((col) =>
  //     selectedColumns.includes(col)
  //   )
  //   setMissingColumns(missing)
  //   setIsDisabled(missing.length > 0)
  // }
  // useEffect(() => {
  //   validateSelection()
  // }, [selectedColumns, RequiresColumns])

  const onTableHeadSelectChange = (colIndex: number, value: string) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = [...prev]
      if (prev[colIndex] === value || value === "skip") {
        newSelectedColumns[colIndex] = "skip"
      } else {
        newSelectedColumns[colIndex] = value
      }
      return newSelectedColumns
    })
  }

  const handleContinue = () => {
    const filteredData = {
      body: body.map((row) =>
        row.map((cell, index) => {
          if (selectedColumns[index] === "skip") {
            return "skip"
          }
          return cell
        })
      ),
      headers: selectedColumns
    }
    const parsedData = filteredData.body.map((row) =>
      filteredData.headers.reduce((acc, key, i) => {
        if (key === "skip") return acc
        return { ...acc, [key]: row[i] }
      }, {})
    ) as ApiFromValues[]

    const formattedData = parsedData.map((item: ApiFromValues) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount + "")),
      // date: format(parse(item.date, InputFormat, new Date()), OutputFormat)
      date: parse(item.date, InputFormat, new Date())
    }))
    console.log({ formatted: formattedData })

    onSubmit(formattedData)
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col gap-y-2 gap-x-2 lg:flex-row items-center">
            <Button onClick={onCancel} size="sm" className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isEnable}
              size="sm"
              className="w-full lg:w-auto"
            >
              Continue ({progress} / {RequiresColumns.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            onTableHeadSelectChange={onTableHeadSelectChange}
            selectedColumns={selectedColumns}
          />
        </CardContent>
      </Card>
    </div>
  )
}
