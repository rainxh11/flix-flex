import { useEffect } from "react"
import { useStateDebounced } from "../../hooks"
import { TextField, IconButton, InputAdornment } from "@mui/material"
import { Clear, Search } from "@mui/icons-material"
export function DebouncedSearchBox({
  onChange,
  delay = 500,
}: {
  onChange: (val: string) => void
  delay: number
}) {
  const [debouncedSearch, searchInput, setSearchInput] = useStateDebounced(
    "",
    delay,
  )
  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch])
  return (
    <TextField
      sx={{ flexGrow: 1, width: "100%" }}
      id="input-with-sx"
      label="Search"
      variant="outlined"
      value={searchInput}
      onChange={e => {
        e.stopPropagation()
        e.preventDefault()
        setSearchInput(e.target.value)
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: "primary.main", mr: 1, my: 0.5 }} />
          </InputAdornment>
        ),
        endAdornment: (
          <IconButton
            aria-label="clear"
            onClick={() => {
              setSearchInput("")
              onChange("")
            }}>
            <Clear />
          </IconButton>
        ),
      }}
    />
  )
}
