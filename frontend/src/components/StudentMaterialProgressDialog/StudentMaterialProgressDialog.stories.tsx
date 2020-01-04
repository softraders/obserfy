import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import StudentMaterialProgressDialog from "./StudentMaterialProgressDialog"
import { MaterialProgressStatus } from "../StudentProgressSummaryCard/StudentProgressSummaryCard"

export default {
  title: "Core|StudentMaterialProgressDialog",
  component: StudentMaterialProgressDialog,
  parameters: {
    componentSubtitle: "Just a simple StudentMaterialProgressDialog",
  },
}

export const Basic: FC = () => (
  <StudentMaterialProgressDialog
    onDismiss={action("dismiss")}
    progress={{
      presentedDate: new Date(),
      status: MaterialProgressStatus.UNTOUCHED,
      name: "Globe",
    }}
  />
)
