import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import firebaseApp from '@/firebase'
import { useAppDispatch } from '@/redux'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { addDocument, getOneDocument } from '@/firebase/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IUser, setUser } from '@/redux/userSlice'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = getAuth(firebaseApp)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  // const [isReEnterPasswordVisible, setReEnterIsPasswordVisible] = useState(false)

  const handleAuthentication = async () => {
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      // Extract serializable user data
      await addDocument('users', user.uid, {
        id: user.uid,
        username: name || '',
        email: user.email,
        password: password, // Note: Storing passwords in plain text is not recommended
      })
      await AsyncStorage.setItem('userId', user.uid)

      const userInfo = await getOneDocument<IUser>('users', user.uid)
      dispatch(setUser(userInfo as IUser))
      Toast.show({
        type: 'success',
        text1: 'Đăng ký thành công! 👋',
      })

      router.push(ERouteTable.HOME)
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message ? error.message : 'Đăng ký thất bại, vui lòng thử lại!',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SafeAreaView className="bg-white h-full relative flex-1">
        <View className="mx-4">
          <Image
            source={images.logoApp}
            className="h-[80px] w-[92px] mt-10 mx-auto rounded"
            resizeMode="contain"
          />
          <Text className="text-center text-2xl font-bold mt-10">Đăng ký</Text>
          <Text className="mt-2 mb-4 text-center text-gray-500">Đăng ký tài khoản của bạn</Text>

          <TextInput
            className="border p-3 border-gray-300 rounded-2xl"
            placeholder="Tên"
            onChangeText={(e) => {
              setName(e)
            }}
          />
          <TextInput
            className="border mt-4 p-3 border-gray-300 rounded-2xl"
            placeholder="Email"
            onChangeText={(e) => {
              setEmail(e)
            }}
          />
          <View className="relative">
            <TextInput
              className="border mt-4 p-3 border-gray-300 rounded-2xl"
              placeholder="Mật khẩu"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(e) => {
                setPassword(e)
              }}
            />
            <TouchableOpacity
              className="absolute right-5 top-7"
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* <View className="relative">
            <TextInput
              className="border mt-4 p-3 border-gray-300 rounded-2xl"
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={!isReEnterPasswordVisible}
            />
            <TouchableOpacity
              className="absolute right-5 top-7"
              onPress={() => setReEnterIsPasswordVisible(!isReEnterPasswordVisible)}
            >
              <Ionicons
                name={isReEnterPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View> */}

          <CustomButton
            title="Đăng ký"
            onPress={handleAuthentication}
            containerStyle="w-full mt-7 bg-[#EE4F1C] min-h-[48px]"
            textStyle="text-white"
            isLoading={loading}
          />
        </View>
      </SafeAreaView>
      <View className="w-full bg-white">
        <View className="flex-row gap-1 flex text-center pb-10 mx-auto">
          <Text>Bạn đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => router.push(ERouteTable.SIGIN_IN)}>
            <Text className="text-[#2D68F8] font-bold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default SignUp
