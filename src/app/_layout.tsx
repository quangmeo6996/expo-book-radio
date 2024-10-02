import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import React, { useCallback, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from '@/redux'
import service from '@/constants/playbackService'
import TrackPlayer from 'react-native-track-player'
import { AppRegistry } from 'react-native'
import App from '@/app/index'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import Toast from 'react-native-toast-message'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('@/assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('@/assets/fonts/Poppins-Thin.ttf'),
  })
  AppRegistry.registerComponent('appName', () => App)
  TrackPlayer.registerPlaybackService(() => service)
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  })

  useLogTrackPlayerState()

  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  if (!fontsLoaded) return null

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}></Stack>
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  )
}

export default RootLayout
