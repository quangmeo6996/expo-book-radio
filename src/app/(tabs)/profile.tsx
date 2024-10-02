import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'
import { useAppDispatch, useAppSelector } from '@/redux'
import { removeUser } from '@/redux/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
  const { user } = useAppSelector((state) => state.user)
  // const [activeNotify, setActiveNotify] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const onLogout = async () => {
    await dispatch(removeUser())
    await AsyncStorage.removeItem('userId')
    router.push(ERouteTable.SIGIN_IN)
  }

  return (
    <SafeAreaView className="px-4 bg-white pb-6 flex-1">
      <View className="flex-row flex justify-center items-center pb-2 border-b border-b-[#D1D5DB]">
        <Text className="font-medium text-xl">Hồ sơ</Text>
      </View>
      <View className="mx-4 mt-[28px]">
        <View className="flex flex-col m-auto items-center mt-8 mb-12">
          <Image
            source={user?.avatar ? { uri: user?.avatar } : images.profile}
            className="w-[108px] h-[108px] rounded-full"
            resizeMode="cover"
          />
          <Text className="font-bold text-2xl mt-3 mb-[32px]">{user?.username}</Text>
        </View>
        <TouchableOpacity
          className="flex-row justify-between items-center pb-2 border-b border-b-[#D1D5DB] mt-2"
          onPress={() => router.navigate('/edit-profile')}
        >
          <View className="flex flex-row gap-2 items-center">
            <Image source={images.iconProfile} className="w-[48px] h-[48px]" resizeMode="cover" />
            <Text className="font-bold text-base">Thông tin</Text>
          </View>
          <AntDesign name="right" size={20} color="#6B7280" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => router.navigate('/change-pasword')}
          className="flex-row justify-between items-center pb-2 border-b border-b-[#D1D5DB] mt-2"
        >
          <View className="flex flex-row gap-2 items-center">
            <Image
              source={images.iconChangePass}
              className="w-[48px] h-[48px]"
              resizeMode="cover"
            />
            <Text className="font-bold text-base">Đổi mật khẩu</Text>
          </View>
          <AntDesign name="right" size={20} color="#6B7280" />
        </TouchableOpacity> */}
        {/* <View className="flex-row justify-between items-center pb-2 border-b border-b-[#D1D5DB] mt-2">
          <View className="flex flex-row gap-2 items-center">
            <Image
              source={images.iconNotification}
              className="w-[48px] h-[48px]"
              resizeMode="cover"
            />
            <Text className="font-bold text-base">Thông báo</Text>
          </View>
          <Switch value={activeNotify} onChange={() => setActiveNotify(!activeNotify)} />
        </View> */}
        <TouchableOpacity
          onPress={onLogout}
          className="flex-row justify-between items-center pb-2 border-b border-b-[#D1D5DB] mt-2"
        >
          <View className="flex flex-row gap-2 items-center">
            <Image source={images.iconLogout} className="w-[48px] h-[48px]" resizeMode="cover" />
            <Text className="font-bold text-base">Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({})
