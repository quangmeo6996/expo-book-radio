import { StyleSheet, View, Image } from 'react-native'
import React from 'react'

export const LoadingAnimation = () => {
  return (
    <View style={styles.container}>
      <View className="flex flex-row justify-center items-center mt-60">
        <Image className="w-20 h-20" alt="avatar" source={require('../../assets/loading.gif')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    zIndex: 1,
    width: '100%',
    height: '100%',
    flex:1,
  },
})
