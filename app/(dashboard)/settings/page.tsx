import { SettingsCard } from "./settings-card"
import { cn } from "@/lib/utils"
import React from "react"

const SettingPage = () => {
  return (
    <div className={cn("w-full max-w-screen-2xl mx-auto pb-10 -mt-24")}>
      <SettingsCard />
    </div>
  )
}

export default SettingPage
