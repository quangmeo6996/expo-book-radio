import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { images } from '@/constants'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

export interface IDataItemBook {
  id: string
  image: string
  name: string
  author: string
  rating: number
}

interface ItemBookProps {
  type: string
  data: any
}

export default function ItemBook({ type, data }: ItemBookProps) {
  const windowWidth = Dimensions.get('window').width
  const calculatedWidth = (windowWidth - 60) / 2

  return (
    <TouchableOpacity
      className="bg-[#F3F4F6] rounded-[20px] mr-2"
      style={{ width: calculatedWidth }}
      onPress={() => router.push({ pathname: '/detail-book', params: { bookId: data.id } })}
    >
      <View className="h-[228px] relative" style={{ width: calculatedWidth }}>
        <Image
          style={{ width: calculatedWidth }}
          source={{ uri: data.thumbnail }}
          className="w-full h-[228px] rounded-t-3xl"
        />
        {type === 'play' && (
          <View className="absolute bottom-2 right-2">
            <Image source={images.iconPlay} className="w-[24px] h-[24px]" resizeMode="cover" />
          </View>
        )}
      </View>
      <View className="p-4">
        <Text className="text-xs">{data.author}</Text>
        <Text className="text-sm font-semibold mt-0.5" numberOfLines={1}>
          {data.name}
        </Text>
        <View className="flex-row flex gap-1 mt-0.5">
          <MaterialIcons name="star-rate" size={14} color="#EE4F1C" />
          <Text className="text-xs font-semibold text-[#EE4F1C]">{data.rate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
