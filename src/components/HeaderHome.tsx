import { View, Text, Image, TouchableOpacity } from 'react-native'
import { images } from '@/constants'
import { EvilIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface IHeaderHome {
  title: string
}

export default function HeaderHome({ title }: IHeaderHome) {
  return (
    <View className="flex-row flex justify-between items-center pb-2">
      <Image
        source={images.logoApp}
        className="w-full max-w-[40px] h-[40px] rounded-full"
        resizeMode="contain"
      />
      <Image
        source={images.logoTextApp}
        className="w-full max-w-[125px] h-[40px] rounded-full"
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => router.push('/search')}>
        <EvilIcons name="search" size={30} color="#6B7280" />
      </TouchableOpacity>
    </View>
  )
}
