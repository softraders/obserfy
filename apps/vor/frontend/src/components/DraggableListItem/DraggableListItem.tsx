import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import React, { FC, MouseEvent, TouchEvent, useRef, useState } from "react"
import { Box, Flex, ThemeUIStyleObject } from "theme-ui"
import { ReactComponent as GridIcon } from "../../icons/grid_round.svg"

function useTransientState<T>(defaultState: T, subscribe: (state: T) => void) {
  const currentState = useRef<T>(defaultState)

  return (state: T) => {
    currentState.current = state
    subscribe(state)
  }
}

const getDomScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop
}

interface Props {
  order: number
  moveItem: (order: number, newOrder: number) => void
  height: number
  sx?: ThemeUIStyleObject
}
export const DraggableListItem: FC<Props> = ({
  children,
  moveItem,
  order,
  height,
  sx,
}) => {
  const container = useRef<HTMLDivElement>(null)
  const setTranslateY = useTransientState(0, (state) => {
    if (container.current) {
      container.current.style.transform = `translateY(${state}px)`
    }
  })

  const [isGrabbed, setIsGrabbed] = useState(false)
  const mouseStartingYPosition = useRef(0)
  const originalOrder = useRef(0)
  const dragHandle = useRef<HTMLDivElement>(null)

  // used to make drag handle on the middle of the item
  const itemMidPoint = height / 2

  const recalculateYTranslate = (mouseYPosition: number) => {
    const domScrollPosition = getDomScrollPosition()
    setTranslateY(mouseYPosition + domScrollPosition - itemMidPoint)
  }

  const handleDrag = (e: MouseEvent | TouchEvent, mouseYPosition: number) => {
    if (!isGrabbed) return
    e.preventDefault()
    e.stopPropagation()

    recalculateYTranslate(mouseYPosition)
    const dragYOffset = mouseYPosition - mouseStartingYPosition.current
    const orderOffset =
      dragYOffset < 0
        ? Math.ceil((dragYOffset - itemMidPoint) / height)
        : Math.floor((dragYOffset + itemMidPoint) / height)

    moveItem(order, originalOrder.current + orderOffset)
  }

  const handleGrabbed = (
    e: MouseEvent | TouchEvent,
    mouseYPosition: number
  ) => {
    if (!dragHandle.current) return
    e.preventDefault()
    e.stopPropagation()
    disableBodyScroll(dragHandle.current, {
      reserveScrollBarGap: true,
    })

    recalculateYTranslate(mouseYPosition)
    mouseStartingYPosition.current = mouseYPosition
    originalOrder.current = order
    setIsGrabbed(true)
  }

  const handleReleased = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dragHandle.current) return
    enableBodyScroll(dragHandle.current)
    setTranslateY(0)
    setIsGrabbed(false)
  }

  return (
    <Box
      sx={{ height, ...sx }}
      onMouseMove={(e) => handleDrag(e, e.clientY)}
      onTouchMove={(e) => handleDrag(e, e.targetTouches[0].clientY)}
    >
      <Flex
        ref={container}
        backgroundColor={isGrabbed ? "surface" : "transparent"}
        sx={{
          height,
          alignItems: "center",
          userSelect: "none",
          width: "100%",
          boxShadow: isGrabbed ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
          position: isGrabbed ? "absolute" : "relative",
          zIndex: isGrabbed ? 10 : 1,
          top: 0,
        }}
      >
        <Box
          px={3}
          py={2}
          sx={{ cursor: "move" }}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => handleGrabbed(e, e.clientY)}
          onTouchStart={(e) => handleGrabbed(e, e.targetTouches[0].clientY)}
          onMouseUp={handleReleased}
          onTouchEnd={handleReleased}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          ref={dragHandle}
        >
          <GridIcon width={20} />
        </Box>
        {children}
      </Flex>
    </Box>
  )
}

export default DraggableListItem
