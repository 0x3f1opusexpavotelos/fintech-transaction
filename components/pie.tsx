import { PieVariant } from "@/components/pie-variant"
import { RadarVariant } from "@/components/radar-variant "
import { RadialVariant } from "@/components/radial-variant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, PieChart, Radar, Target } from "lucide-react"
import { useState } from "react"
type Props = {
  data?: {
    name: string
    value: number
  }[]
}

export const Pie = ({ data = [] }: Props) => {
  const [pieType, setPieType] = useState("pie")

  const onTypeChange = (value: string) => {
    // TODO add pay wall
    setPieType(value)
  }
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex gap-y-1 lg:flex-row lg:justify-between items-center ">
        <CardTitle>Categories</CardTitle>
        <Select defaultValue={pieType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="char type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Pie chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radial chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radar chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <>
          {pieType === "pie" && <PieVariant data={data} />}
          {pieType === "radial" && <RadialVariant data={data} />}
          {pieType === "radar" && <RadarVariant data={data} />}
        </>
      </CardContent>
    </Card>
  )
}

export const PieLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  )
}
