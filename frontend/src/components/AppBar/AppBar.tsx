import React, { FC, MouseEventHandler, useRef, useState } from "react"
import GatsbyImage from "gatsby-image"
import { navigate } from "gatsby"
import Typography from "../Typography/Typography"
import { ReactComponent as StorefrontIcon } from "../../icons/storefront.svg"
import { ReactComponent as LogoutIcon } from "../../icons/logout.svg"
import Avatar from "../Avatar/Avatar"
import Icon from "../Icon/Icon"
import { ReactComponent as ArrowDownIcon } from "../../icons/arrow-down-outline.svg"
import { Card } from "../Card/Card"
import { useOutsideClick } from "../../hooks"
import Spacer from "../Spacer/Spacer"
import MenuIcon from "./MenuIcon"
import Flex, { FlexProps } from "../Flex/Flex"
import Box from "../Box/Box"
import { useAvatarPlaceholder } from "../../useAvatarPlaceholder"

interface Props {
  onMenuClick?: MouseEventHandler<HTMLImageElement>
  position?: "fixed" | "relative"
  title: string
}

export const AppBar: FC<Props> = ({
  onMenuClick,
  title,
  position = "relative",
}) => {
  return (
    <Card
      as="header"
      backgroundColor="surface"
      height="appbar"
      width="100%"
      display="flex"
      borderRadius={0}
      sx={{
        alignItems: "center",
        borderColor: "border",
        zIndex: 50,
        top: 0,
        position,
      }}
    >
      <SchoolName
        alignItems="center"
        height={57}
        width={[0, "auto"]}
        overflow="hidden"
      />
      <MenuIcon onMenuClick={onMenuClick} />
      <Typography.H6 fontWeight="body" opacity={[1, 0]} mb={0} ml={[0, 3]}>
        {title}
      </Typography.H6>
      <Spacer />
      <UserAvatar />
    </Card>
  )
}

export const SchoolName: FC<FlexProps> = ({ ...props }) => (
  <Flex height="appbar" {...props}>
    <Icon as={StorefrontIcon} size={24} alt="Store Icon" />
    <Typography.Body as="div" ml="-4px" mb={0} sx={{ whiteSpace: "nowrap" }}>
      Joyful Montessori
    </Typography.Body>
  </Flex>
)

const UserAvatar: FC = () => {
  const [isShowingOption, setIsShowingOption] = useState(false)
  const element = useRef<HTMLElement>(null)
  const avatar = useAvatarPlaceholder()
  useOutsideClick(element, () => setIsShowingOption(false))

  return (
    <Flex
      ref={element}
      mx={3}
      p={1}
      alignItems="center"
      onClick={() => setIsShowingOption(!isShowingOption)}
      sx={{
        borderStyle: "solid",
        borderRadius: "circle",
        borderColor: "border",
        borderWidth: 1,
        cursor: "pointer",
        transition: "background-color 250ms cubic-bezier(0.0, 0.0, 0.2, 1)",
        "&:hover": {
          backgroundColor: "muted",
        },
      }}
      data-cy="schoolName"
    >
      <Avatar as={Box}>
        <GatsbyImage fixed={avatar} alt="avatar" />
      </Avatar>
      <Typography.Body
        as="div"
        ml={2}
        mr={1}
        my={0}
        display={["none", "block"]}
      >
        {name}
      </Typography.Body>
      <Icon
        as={ArrowDownIcon}
        alt="Store Icon"
        m={0}
        ml={[2, 0]}
        mr={[2, 1]}
        opacity={0.4}
      />
      {isShowingOption && <SignOutCard />}
    </Flex>
  )
}

const SignOutCard: FC = () => {
  async function logout(): Promise<void> {
    const response = await fetch("/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })
    if (response.status === 200) {
      navigate("/login")
    }
  }

  return (
    <Card
      onClick={logout}
      sx={{
        top: 52,
        right: 3,
        position: "fixed",
        boxShadow: "low",
        borderRadius: "default",
      }}
    >
      <Flex alignItems="center" width={140}>
        <Icon as={LogoutIcon} size={20} />
        <Typography.Body m={0}>Log out</Typography.Body>
      </Flex>
    </Card>
  )
}

export default AppBar
