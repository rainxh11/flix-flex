/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSeriesDetails } from "./useSeriesDetails"
import { useParams, useRouter } from "@tanstack/react-router"
import { parse, format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { sumBy, chain } from "lodash"

import {
  CardMedia,
  Box,
  Chip,
  Stack,
  Button,
  Grid,
  Typography,
  Container,
} from "@mui/material"
import { Circle, ArrowBack, Link as LinkIcon } from "@mui/icons-material"
import { useTmdb } from "../../hooks/tmdb"
import { useComputed, useRotatedList } from "../../hooks"
import { SpinnerWrapper } from "../Shared/Spinner"
import * as colors from "@mui/material/colors"
import { CastCardList } from "../Cast/CastCardList"
import { VideosList } from "../Shared/VideosList"
import { RatingCircle } from "../Shared/RatingCircle"

import { FormatMoney } from "format-money-js"

const formatCurrency = new FormatMoney({
  decimals: 0,
  symbol: "$",
})

const DotIcon = () => <Circle sx={{ fontSize: 8 }} />

export function TvSeriesDetails() {
  const router = useRouter()
  const { seriesId } = useParams({ strict: false }) as { seriesId: string }
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
    lastSeasonDetails,
    lastSeasonImages,
    seasonsDetails,
  } = useSeriesDetails({ seriesId: parseInt(seriesId) })
  const backdrop = useRotatedList(images.data?.backdrops ?? [], 5000)
  const styles = {
    backgroundOverlayColor: {
      backgroundImage:
        "linear-gradient(to right, rgba(37, 56, 111,0.92) calc((50vw - 170px) - 340px), rgba(91.5, 90.5, 31.5,0.8) 50%, rgba(49, 22, 93,0.5) 100%);",
    },
  }
  const releaseDate = useComputed(() => {
    try {
      const parsed = parse(
        details.data!.first_air_date!,
        "yyyy-MM-dd",
        new Date(),
      )
      const year = format(parsed, "yyyy")
      return { year: year, date: format(parsed, "yyyy-MM-dd") }
    } catch {
      return { date: "N/A", year: "N/A" }
    }
  }, [details.data?.first_air_date])
  const averageEpisodeRuntime = useComputed(() => {
    if (details.data)
      return (
        sumBy(details.data.episode_run_time, x => x) /
        details.data.episode_run_time.length
      )
    else return 0
  }, [details.data])

  // const castWithEpsList = useComputed(() => {
  //   if (isLoading) return []
  //   const crew = chain(seasonsDetails)
  //     .flatMap(x => x.data?.episodes)
  //     .flatMap(x => x?.crew)
  //     .map(x => x?.credit_id)
  //     .value()
  //   return credits.data?.cast.map(cast => ({
  //     ...cast,
  //     episodeCount: crew.filter(x => x === cast.credit_id).length,
  //   }))
  // }, [isLoading, seasonsDetails, credits.data])

  return (
    <>
      <SpinnerWrapper show={isLoading}>
        {/* Movie Header */}
        <Box
          sx={{
            backgroundImage: `url(${getImageUrl(backdrop?.file_path)})`,
            borderBottom: "1px solid var(--primaryColor)",
            backgroundSize: "cover",
            top: "-100px",
            backgroundRepeat: "no-repeat",
            minHeight: "300px",
            width: "100%",
          }}>
          <Box sx={styles.backgroundOverlayColor}>
            <Box paddingY="30px" paddingX="40px" minHeight="300px">
              <Button
                onClick={() => router.history.back()}
                variant="outlined"
                sx={{ marginBottom: "20px", color: "white" }}>
                <ArrowBack />
                <Typography variant="h6">Go Back</Typography>
              </Button>
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
                  <Stack
                    flexWrap="wrap"
                    columnGap="100px"
                    rowGap="20px"
                    flexDirection="row"
                    justifyContent="start"
                    alignItems="center">
                    <Box flexShrink={1}>
                      <Typography variant="h4" fontWeight="900">
                        {details.data?.name + " "}
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
                    <Box
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                      columnGap="10px">
                      <Typography fontWeight="400" variant="h4">
                        User Score:
                      </Typography>
                      <RatingCircle rating={details.data?.vote_average ?? 0} />
                    </Box>
                  </Stack>

                  <Stack
                    flexWrap="wrap"
                    columnGap="10px"
                    flexDirection="row"
                    alignItems="center">
                    <Typography fontWeight="light" variant="h6">
                      {releaseDate.date}
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
                      {details.data?.genres?.map(x => x.name).join(", ")}
                    </Typography>
                    <DotIcon />
                    <Typography>
                      {lastSeasonDetails.data?.season_number ?? 1}
                      {" Seasons"}
                    </Typography>
                    <DotIcon />
                    <Typography>
                      {chain(seasonsDetails)
                        .flatMap(x => x.data?.episodes)
                        .value().length ?? 0}
                      {" Episodes"}
                    </Typography>
                    <DotIcon />
                    <Typography>Average Episode Runtime:</Typography>
                    <Typography>
                      {humanizeDuration(averageEpisodeRuntime * 60 * 1000)}
                    </Typography>
                  </Stack>

                  <Box>
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
        <Grid container spacing={2} marginY={2} marginBottom={10}>
          <Grid item xs={12} md={9}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "40px",
              }}>
              <Box>
                <Typography marginLeft={2} variant="h4" fontWeight={600}>
                  Cast
                </Typography>
                <CastCardList castList={credits.data?.cast} />
              </Box>
              <Box>
                <Typography marginLeft={2} variant="h4" fontWeight={600}>
                  Trailers & Teasers
                </Typography>
                <VideosList
                  videos={videos.data?.results.filter(x =>
                    ["Trailer", "Teaser"].includes(x.type),
                  )}
                />
              </Box>
            </Container>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack display="flex" flex={1} flexDirection="column" rowGap="20px">
              <a href={details.data?.homepage} style={{ color: "black" }}>
                <LinkIcon fontSize="large" />
              </a>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Status
                </Typography>
                <Typography variant="subtitle2">
                  {details.data?.status ?? "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Original Language
                </Typography>
                <Typography variant="subtitle2">
                  {details.data?.original_language ?? "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Network
                </Typography>
                <Stack
                  flexDirection="column"
                  flex={1}
                  display="flex"
                  rowGap="10px">
                  {details.data?.networks?.map(network => (
                    <img
                      loading="lazy"
                      width="150px"
                      src={getImageUrl(network.logo_path, 200)}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Type
                </Typography>
                <Typography variant="subtitle2">
                  {details.data?.type}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Keywords
                </Typography>

                <Stack
                  display="flex"
                  flex={1}
                  flexDirection="row"
                  columnGap="10px"
                  rowGap="10px"
                  marginRight="10px"
                  flexWrap="wrap">
                  {keywords.data?.keywords?.map(keyword => (
                    <Chip label={keyword.name} />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/*  */}
      </SpinnerWrapper>
    </>
  )
}
