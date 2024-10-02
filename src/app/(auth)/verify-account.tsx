import { Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

const VerifyAccount = () => {
  return (
    <>
      <SafeAreaView className="bg-white h-full relative flex-1">
        <View className="mx-4">
          <Text className="text-center text-2xl font-bold mt-10">Xác thực tài khoản</Text>
          <Text className="mt-2 text-center text-gray-500">
            Chúng tôi phải gửi mã xác minh tới email
          </Text>
          <Text className="mt-2 mb-4 font-bold text-center text-gray-500">***demo@gmail.com</Text>
          <TextInput
            className="border p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập mã xác thực"
          />
          <CustomButton
            title="Xác thực"
            onPress={() => router.push(ERouteTable.HOME)}
            containerStyle="w-full mt-7 mb-2 bg-[#EE4F1C] min-h-[48px]"
            textStyle="text-white"
          />
          <View className="flex-row gap-1 flex mx-auto">
            <Text className="font-light">Gửi lại mã sau</Text>
            <Text className="text-primary-600 font-bold">60S</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

export default VerifyAccount
