import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player'
import Slider from '@react-native-community/slider'

const MusicPlayer: React.FC = () => {
  const playbackState = usePlaybackState()
  const progress = useProgress()

  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    setupPlayer()
    return () => {
      TrackPlayer.reset() // Use reset instead of destroy
    }
  }, [])

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.add({
      id: 'trackId',
      url: 'https://audio.jukehost.co.uk/vTRYaTEbpaYRCxiWGgL2S91mnOuMKfLw',
      title: 'Track Title',
      artist: 'Track Artist',
    })

    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      compactCapabilities: [Capability.Play, Capability.Pause],
    })
  }

  const togglePlayPause = async () => {
    if (playbackState === State.Playing) {
      await TrackPlayer.pause()
      setIsPlaying(false)
    } else {
      await TrackPlayer.play()
      setIsPlaying(true)
    }
  }

  const skipForward = async () => {
    let newPosition = progress.position + 10
    if (newPosition > progress.duration) newPosition = progress.duration
    await TrackPlayer.seekTo(newPosition)
  }

  const skipBackward = async () => {
    let newPosition = progress.position - 10
    if (newPosition < 0) newPosition = 0
    await TrackPlayer.seekTo(newPosition)
  }

  const onSliderValueChange = async (value: number) => {
    await TrackPlayer.seekTo(value)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={skipBackward} style={styles.button}>
        <Text style={styles.buttonText}>⏪ 10s</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
        <Text style={styles.buttonText}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={skipForward} style={styles.button}>
        <Text style={styles.buttonText}>⏩ 10s</Text>
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        onValueChange={onSliderValueChange}
      />
      <TouchableOpacity onPress={() => {}} style={styles.button}>
        <Text style={styles.buttonText}>🔊</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
})

export default MusicPlayer
