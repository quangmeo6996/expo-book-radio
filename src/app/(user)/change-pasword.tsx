import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'

export default function ChangePasword() {
  return (
    <SafeAreaView className="px-4 bg-white pb-6 flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-row flex items-center pb-2 relative mb-8 border-b border-b-[#D1D5DB]">
        <TouchableOpacity onPress={() => router.back()} className="absolute ml-4 bottom-2">
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-xl m-auto">Đổi mật khẩu</Text>
      </View>
      <View className="mx-4">
        <Text className="text-sm text-gray-700">
          Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó
        </Text>
        <TextInput
          className="border h-[50px] mt-4 p-3 border-gray-300 rounded-2xl"
          placeholder="Mật khẩu cũ"
        />
        <TextInput
          className="border h-[50px] mt-4 p-3 border-gray-300 rounded-2xl"
          placeholder="Mật khẩu mới"
        />
        <TextInput
          className="border h-[50px] mt-4 p-3 border-gray-300 rounded-2xl"
          placeholder="Nhập lại mật khẩu mới"
        />
        <CustomButton
          title="Lưu"
          onPress={() => router.push(ERouteTable.SIGIN_IN)}
          containerStyle="w-full mt-7 bg-primary-600 min-h-[48px]"
          textStyle="text-white"
        />
      </View>
    </SafeAreaView>
  )
}
