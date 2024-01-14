import { ReactNode, useState } from "react"
import { DebouncedSearchBox } from "./DebouncedSearchBox"
import { Pagination, Stack } from "@mui/material"
import { clamp } from "lodash"

export type ContentSearchProps = {
  children: (searchQuery: string, page: number) => ReactNode
  maxPages: number
}

export function ContentSearch({ children, maxPages }: ContentSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>()
  return (
    <Stack flexDirection="column" alignItems="center" rowGap="20px">
      <DebouncedSearchBox
        onChange={val => {
          setPage(1)
          setSearchQuery(val)
        }}
        delay={500}
      />
      <Pagination
        count={clamp(maxPages, 0, 500)}
        showFirstButton
        showLastButton
        boundaryCount={7}
        onChange={(_, val) => setPage(val)}
      />
      {children(searchQuery, page ?? 1)}
    </Stack>
  )
}
