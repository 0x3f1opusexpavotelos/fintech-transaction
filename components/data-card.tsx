import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CountUp } from "@/components/count-up"

import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { IconType } from "react-icons"

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yello-500/20"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500/20",
      success: "fill-emerald-500/20",
      danger: "fill-rose-500/20",
      warning: "fill-yello-500/20"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

type BoxVariants = VariantProps<typeof boxVariant>

type IconVariants = VariantProps<typeof iconVariant>

interface DataCardProps extends BoxVariants, IconVariants {
  title: string
  icon: IconType
  dateRange: string
  value?: number
  percentagChange?: number
}

export const DataCard = ({
  icon: Icon,
  title,
  variant,
  dateRange,
  value = 0,
  percentagChange = 0
}: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row justify-between items-center gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-2x line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            separator=","
            decimal="."
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "text-muted-foreground text-sm line-clamp-1",
            percentagChange > 0 && "text-emerald-500",
            percentagChange < 0 && "text-rose-500"
          )}
        >
          {formatPercentage(percentagChange, { addPrefix: true })} since last
          period
        </p>
      </CardContent>
    </Card>
  )
}

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm rounded-md">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24"></Skeleton>
          <Skeleton className="h-4 w-40"></Skeleton>
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-24 mb-2" />
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  )
}
