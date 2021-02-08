import { t } from "@lingui/macro"
import { PageRendererProps } from "gatsby"
import React, { FC } from "react"
import { Box, Flex } from "theme-ui"
import PageCurriculumArea from "../../../../components/PageCurriculumArea/PageCurriculumArea"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import SEO from "../../../../components/seo"
import { useQueryString } from "../../../../hooks/useQueryString"

const Settings: FC<PageRendererProps> = () => {
  const id = useQueryString("id")

  return (
    <>
      <SEO title={t`Areas`} />
      <Flex>
        <Box
          sx={{
            width: "100%",
            maxWidth: ["100%", "100%", 340],
            display: ["none", "none", "block"],
          }}
        >
          <PageCurriculumSettings />
        </Box>
        <PageCurriculumArea id={id} />
      </Flex>
    </>
  )
}

export default Settings
