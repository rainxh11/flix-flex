import * as React from "react"
import { ReactNode } from "react"
import { Dropdown } from "@mui/base"
import { useToggleRefState } from "../../hooks"

export function DropdownMenu(props: {
  children: (val: {
    toggleMenu: () => void
    isOpen: boolean
    anchorRef?: React.MutableRefObject<HTMLElement | undefined>
    anchorEl?: HTMLElement | undefined
  }) => ReactNode
}) {
  const [menuElState, toggleMenu, menuElRef] = useToggleRefState<
    HTMLElement | undefined
  >()

  return (
    <Dropdown>
      {props.children({
        toggleMenu: toggleMenu,
        isOpen: !!menuElState,
        anchorRef: menuElRef,
        anchorEl: menuElState,
      })}
    </Dropdown>
  )
}
