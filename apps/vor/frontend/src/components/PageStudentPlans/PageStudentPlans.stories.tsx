import React, { FC } from "react"
import PageStudentPlans from "./PageStudentPlans"

export default {
  title: "Core|PageStudentPlans",
  component: PageStudentPlans,
  parameters: {
    componentSubtitle: "Just a simple PageStudentPlans",
  },
}

export const Basic: FC = () => <PageStudentPlans studentId="asdfasfd" />
