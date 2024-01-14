import { Rating, type RatingProps } from "@mui/material"

export function FavButton(
  props: Omit<
    RatingProps,
    | "value"
    | "onChange"
    | "max"
    | "precision"
    | "readonly"
    | "getLabelText"
    | "defaultValue"
  > & {
    value: boolean
    defaultValue: boolean
    onChange?: (val: boolean) => void
  },
) {
  return (
    <>
      <Rating
        {...props}
        max={1}
        value={props.value ? 1 : 0}
        defaultValue={props.defaultValue ? 1 : 0}
        onChange={(_, v) => !!props.onChange && props.onChange(!!v && v > 0)}
        getLabelText={val => (val > 0 ? "In Favorites" : "Add To Favorites")}
        precision={1}
      />
    </>
  )
}
