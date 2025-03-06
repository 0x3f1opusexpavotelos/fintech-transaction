/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

import { useCSVReader } from "react-papaparse"

export interface ParseMeta {
  // Dellimiter used,
  delimiter: string
  linebreak: string
  aborted: boolean
  fields?: string[] | undefined
  truncated: boolean
  curosr: number
}

export interface ParseError {
  type: "Quotes" | "Delimiter" | "FieldMisMatch"
  code:
    | "MissingQuotes"
    | "UndetectableDelimiter"
    | "TooFewFields"
    | "TooManyFiels"
    | "InvalidQuotes"
  message: string
  // Row index of parse data where error is
  row?: number | undefined
  // Index within the row where error is
  index: number | undefined
}

export interface ParseResult<T> {
  /**
   * an array of rows. If header is false, rows are arrays; otherwise they are objects of data keyed by the field name.
   */
  data: T[]
  errors: ParseError[]
  meta: ParseMeta
}

// const styles = {
//   browseFile: {
//     width: "20%"
//   } as CSSProperties
// }

type Props = {
  onUploadAccepted: (results: any) => void
}

export const ImportButton = ({ onUploadAccepted }: Props) => {
  const { CSVReader } = useCSVReader()
  return (
    <CSVReader
      onUploadAccepted={onUploadAccepted}
      config={{ skipEmptyLines: true }}
    >
      {({ getRootProps }: any) => (
        <Button size="sm" className="w-full lg:w-atuo" {...getRootProps()}>
          <Upload className="mr-2 size-4" />
          Import
        </Button>
      )}
    </CSVReader>
  )
}
