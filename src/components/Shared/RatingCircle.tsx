import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export function RatingCircle(
  props: Omit<CircularProgressProps, "variant" | "color" | "value"> & {
    rating: number
  },
) {
  return (
    <Box
      sx={{
        width: "45px",
        height: "45px",
        padding: "2px",
        borderRadius: "50%",
        backgroundColor: "#081c22",
        position: "relative",
        display: "inline-block",
        color: "white",
      }}>
      <CircularProgress
        variant="determinate"
        value={props.rating * 10}
        color={
          props.rating >= 7
            ? "success"
            : props.rating <= 5
            ? "error"
            : "primary"
        }
      />

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          padding: "1px",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography variant="body1" component="div">
          {props.rating.toFixed(1)}
        </Typography>
      </Box>
    </Box>
  )
}
