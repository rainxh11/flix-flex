import { CircularProgress, CircularProgressProps } from "@mui/material"
import { ReactNode } from "react"

export function Spinner(props: Omit<CircularProgressProps, "variant">) {
  return <CircularProgress variant="indeterminate" {...props} />
}
export function SpinnerWrapper({
  show,
  children,
  ...rest
}: { show: boolean; children: ReactNode } & Omit<
  CircularProgressProps,
  "variant"
>) {
  return <>{show ? <Spinner {...rest} /> : children}</>
}
