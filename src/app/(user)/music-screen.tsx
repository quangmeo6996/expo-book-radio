import { PlayerControls } from '@/components/PlayerControls'
import { PlayerProgressBar } from '@/components/PlayerProgressbar'
import { screenPadding } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { AntDesign } from '@expo/vector-icons'
import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useActiveTrack } from 'react-native-track-player'
import { router } from 'expo-router'
import HeaderComponent from '@/components/HeaderComponent'
import React from 'react'

const MusicScreen = () => {
  const activeTrack = useActiveTrack()
  return (
    <ImageBackground
      source={{
        uri: activeTrack?.thumbnail,
      }}
      resizeMode="cover"
      className="flex-1"
    >
      <StatusBar barStyle={'light-content'} />
      <View className="flex-1 opacity-95" style={{ backgroundColor: '#000000BF' }}>
        <View style={styles.overlayContainer}>
          <HeaderComponent
            title="Sách nói"
            iconLeft={
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            }
            styleHeader="mt-12"
            styleTitle="text-white"
          />
          <View style={{ flex: 1, marginTop: 70 }}>
            <View style={styles.artworkImageContainer}>
              <FastImage
                source={{
                  uri: activeTrack?.thumbnail,
                  priority: FastImage.priority.high,
                }}
                resizeMode="cover"
                style={styles.artworkImage}
              />
            </View>
            <View className="text-center flex flex-row mt-3 justify-center">
              {/* Track artist */}
              {activeTrack?.author && (
                <Text numberOfLines={1} className="text-white text-xs">
                  {activeTrack.author}
                </Text>
              )}
            </View>
            {activeTrack?.name && (
              <Text numberOfLines={2} className="text-white mt-2 font-semibold text-center text-xl">
                {activeTrack.name}
              </Text>
            )}
            <View style={{ flex: 1 }}>
              <View>
                <PlayerProgressBar style={{ marginTop: 32 }} />
                <PlayerControls style={{ marginTop: 40 }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  artworkImageContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: '45%',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: '700',
  },
})

export default MusicScreen
