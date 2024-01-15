export function YoutubeEmbed(props: {
  videoKey: string
  height: number
  width: number
}) {
  return (
    <iframe
      width={props.width}
      height={props.height}
      src={`https://www.youtube.com/embed/${props.videoKey}`}
    />
  )
}
