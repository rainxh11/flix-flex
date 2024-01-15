import { useMovieDetails } from "./useMovieDetails"
import { useParams } from "@tanstack/react-router"
import { parse, format } from "date-fns"
import humanizeDuration from "humanize-duration"

import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Box,
  Stack,
  Grid,
  Typography,
} from "@mui/material"
import { Circle } from "@mui/icons-material"
import { useTmdb } from "../../hooks/tmdb"
import { useComputed, useRotatedList } from "../../hooks"
import { SpinnerWrapper } from "../Shared/Spinner"
import * as colors from "@mui/material/colors"
import { CastCardList } from "../Cast/CastCard"

const DotIcon = () => <Circle sx={{ fontSize: 8 }} />

export function MovieDetails() {
  const { movieId } = useParams({ strict: false }) as { movieId: string }
  const { getImageUrl } = useTmdb()
  const {
    details,
    images,
    videos,
    keywords,
    credits,
    reviews,
    similar,
    isLoading,
    errors,
  } = useMovieDetails({ movieId: parseInt(movieId) })
  const backdrop = useRotatedList(images.data?.backdrops ?? [], 5000)
  const styles = {
    backgroundOverlayColor: {
      backgroundImage:
        "linear-gradient(to right, rgba(31.5, 10.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 10.5, 31.5, 0.84) 50%, rgba(31.5, 10.5, 31.5, 0.84) 100%);",
    },
  }
  const releaseDate = useComputed(() => {
    try {
      const parsed = parse(
        details.data!.release_date!,
        "yyyy-MM-dd",
        new Date(),
      )
      const year = format(parsed, "yyyy")
      return { year: year, date: format(parsed, "yyyy-MM-dd") }
    } catch {
      return { date: "N/A", year: "N/A" }
    }
  }, [details.data?.release_date])

  return (
    <>
      <SpinnerWrapper show={isLoading}>
        {/* Movie Header */}
        <Box
          sx={{
            backgroundImage: `url(${getImageUrl(backdrop?.file_path)})`,
            borderBottom: "1px solid var(--primaryColor)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            minHeight: "300px",
            width: "100%",
          }}>
          <Box sx={styles.backgroundOverlayColor}>
            <Box paddingY="30px" paddingX="40px" minHeight="300px">
              <Stack
                flexDirection="row"
                flex={1}
                display="flex"
                columnGap="30px"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="center">
                <Box width="15%">
                  <CardMedia
                    sx={{ borderRadius: "7px" }}
                    image={getImageUrl(images?.data?.posters[0].file_path)}
                    loading="lazy"
                    component="img"
                  />
                </Box>
                <Box
                  color="white"
                  rowGap="20px"
                  flex={1}
                  flexDirection="column"
                  display="flex">
                  <Box>
                    <Typography variant="h4" fontWeight="900">
                      {details.data?.title + " "}
                      <span
                        style={{
                          color: colors.grey[400],
                          fontWeight: "normal",
                        }}>
                        ({releaseDate.year})
                      </span>
                    </Typography>
                    {details.data?.tagline && (
                      <Typography fontWeight="light" fontStyle="italic">
                        {details.data?.tagline}
                      </Typography>
                    )}
                  </Box>

                  <Stack
                    flexWrap="wrap"
                    columnGap="10px"
                    flexDirection="row"
                    alignItems="center">
                    <Typography fontWeight="light" variant="h6">
                      {releaseDate.date}{" "}
                    </Typography>
                    <DotIcon />
                    <Typography>
                      Language:{" "}
                      <b>
                        {details.data?.original_language.toLocaleUpperCase()}
                      </b>
                    </Typography>
                    <DotIcon />
                    <Typography>
                      {details.data?.genres.map(x => x.name).join(", ")}
                    </Typography>
                    <DotIcon />
                    <Typography>
                      {humanizeDuration(
                        (details.data?.runtime ?? 0) * 60 * 1000,
                        { units: ["h", "m"] },
                      )}
                    </Typography>
                  </Stack>

                  <Box>
                    {" "}
                    <Typography fontWeight="500" variant="h5">
                      Overview
                    </Typography>
                    <Typography fontWeight="300" variant="body1">
                      {details.data?.overview}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
        {/*  */}
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} md={9}>
            <CastCardList castList={credits.data?.cast} />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
        </Grid>
        {/*  */}
      </SpinnerWrapper>
    </>
  )
}
