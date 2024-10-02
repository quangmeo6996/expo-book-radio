/* eslint-disable react-hooks/exhaustive-deps */
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { images } from '@/constants'
import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { useAppDispatch, useAppSelector } from '@/redux'
import { doc, updateDoc } from 'firebase/firestore'
import { firebaseDB, firebaseStorage } from '@/firebase'
import { getOneDocument } from '@/firebase/api'
import { IUser, setUser } from '@/redux/userSlice'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getRandomString } from '@/utils/common'

export default function EditProfile() {
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const [image, setImage] = useState<string | null>(user?.avatar || null)
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions()

  useEffect(() => {
    if (!status || !status.granted) requestPermission()
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    })
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const uploadImage = async (uri: string) => {
    // It won't upload image if image is not change
    if (image != user?.avatar) {
      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
          resolve(xhr.response)
        }
        xhr.onerror = function (e) {
          console.log(e)
          reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
      })
      const avatarName = getRandomString(10) as string
      const fileRef = ref(firebaseStorage, avatarName)
      await uploadBytes(fileRef, blob)

      // We're done with the blob, close and release it
      blob.close()

      const avatarUrl = await getDownloadURL(fileRef)
      return { avatarName, avatarUrl }
    }
    return {
      avatarName: user?.avatarName,
      avatarUrl: user?.avatar,
    }
  }

  const handleUpdateProfile = async () => {
    if (!user?.id) return

    try {
      const userRef = doc(firebaseDB, 'users', user.id)
      let avatarData = { avatarName: user?.avatarName, avatarUrl: user?.avatar }
    
      if (image && image !== user?.avatar) {
        avatarData = await uploadImage(image)
      }
  
      const updateProfile: Partial<IUser> = {
        phone,
        username,
        email,
        avatar: avatarData.avatarUrl || '',
        avatarName: avatarData.avatarName || '',
      }
      console.log("🚀 ~ handleUpdateProfile ~ updateProfile:", updateProfile)
      await updateDoc(userRef, updateProfile)
      // Update Redux state
      const userInfo = await getOneDocument<IUser>('users', user.id)
      dispatch(setUser(userInfo as IUser))
      // dispatch(updateUserProfile({ username, email, phone }))
      router.back()
    } catch (error) {
      console.error('Error updating profile:', error)
      // Handle error (e.g., show an alert to the user)
    }
  }

  return (
    <SafeAreaView
      className="px-4 bg-white pb-6 flex-1"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      <View className="flex-row flex items-center pb-2 relative mb-8 border-b border-b-[#D1D5DB]">
        <TouchableOpacity onPress={() => router.back()} className="absolute ml-4 bottom-2">
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-xl m-auto">Thông tin</Text>
      </View>
      <View className="mx-4 mt-[28px]">
        <View className="flex flex-col m-auto items-center">
          <Image
            source={image ? { uri: image } : images.profile}
            className="w-[108px] h-[108px] rounded-full"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute bottom-0 right-0" onPress={pickImage}>
            <Image source={images.iconCamera} className="w-[36px] h-[36px]" resizeMode="cover" />
          </TouchableOpacity>
        </View>
        <TextInput
          className="border mt-[48px] h-[50px] p-3 border-gray-300 rounded-2xl"
          placeholder="Tên của bạn"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="border mt-4 h-[50px] p-3 border-gray-300 rounded-2xl"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="border mt-4 h-[50px] p-3 border-gray-300 rounded-2xl"
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View className="absolute bottom-8 w-full px-4">
        <CustomButton
          title="Lưu"
          onPress={handleUpdateProfile}
          containerStyle="w-full mt-7 bg-primary-600 min-h-[48px]"
          textStyle="text-white"
        />
      </View>
    </SafeAreaView>
  )
}
