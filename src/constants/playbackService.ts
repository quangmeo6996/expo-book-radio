import TrackPlayer from 'react-native-track-player'

const service = async () => {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
  })

  TrackPlayer.addEventListener('remote-seek', (event) => {
    TrackPlayer.seekTo(event.position)
  })

  // Additional event listeners can be added here
}

export default service
