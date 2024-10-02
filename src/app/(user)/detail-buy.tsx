import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native'
import HeaderComponent from '@/components/HeaderComponent'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import CustomButton from '@/components/CustomButton'
import React, { useState } from 'react'
import { addDocument, uploadImagesToStorage } from '@/firebase/api'
import { categoryArray, IBook, ISellBook } from '@/types/book'
import { useAppSelector } from '@/redux'
import { Dropdown } from 'react-native-element-dropdown'

export default function DetailBuy() {
  const user = useAppSelector((state) => state.user.user)

  const [isFocus, setIsFocus] = useState(false)

  const [inputForm, setInputForm] = useState<IBook>({
    name: '',
    author: '',
    description: '',
    price: 0,
    category: '',
    numberChapter: 0,
    numberPage: 0,
    thumbnail: '',
    quantity: 0,
  })
  const requiredFields: (keyof IBook)[] = [
    'name',
    'author',
    'description',
    'price',
    'category',
    'numberChapter',
    'numberPage',
    'thumbnail',
    'quantity',
  ]
  const isDisabledSubmit = requiredFields.some((field) => !inputForm[field])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setInputForm({ ...inputForm, thumbnail: result.assets[0].uri })
    }
  }
  const onSubmitSellBook = async () => {
    try {
      const imgUrl = await uploadImagesToStorage(inputForm.thumbnail!)
      const dataSubmit: ISellBook = {
        bookInfo: {
          ...inputForm,
          thumbnail: imgUrl,
        },
        userId: user!.id,
      }
      await addDocument('sells', null, dataSubmit)
      router.back()
    } catch (err: any) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView className="bg-white pb-6 flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="mx-4">
        <HeaderComponent
          title="Bán sách"
          iconLeft={
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          }
        />
      </View>
      <ScrollView className="mx-4" showsVerticalScrollIndicator={false}>
        <View>
          <Text className="text-[#6B7280] font-semibold">Tên sách</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập tên sách"
            onChangeText={(text) => setInputForm({ ...inputForm, name: text })}
            value={inputForm.name}
          />
        </View>

        <View className="my-2 space-y-2">
          <Text className="text-[#6B7280] font-semibold">Thể loại</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={categoryArray}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Thể loại' : '...'}
            searchPlaceholder="Search..."
            value={inputForm.category}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setInputForm({ ...inputForm, category: item.value })
              setIsFocus(false)
            }}
          />
        </View>

        <View>
          <Text className="text-[#6B7280] font-semibold">Tác giả</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập tên tác giả"
            onChangeText={(text) => setInputForm({ ...inputForm, author: text })}
            value={inputForm.author}
          />
        </View>
        <View>
          <Text className="text-[#6B7280] font-semibold">Mô tả</Text>
          <TextInput
            className="border my-2 h-[100px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập mô tả"
            multiline
            onChangeText={(text) => setInputForm({ ...inputForm, description: text })}
            value={inputForm.description}
          />
        </View>
        <View>
          <Text className="text-[#6B7280] font-semibold">Giá</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập giá"
            onChangeText={(text) => setInputForm({ ...inputForm, price: Number(text) })}
            value={inputForm.price + ''}
          />
        </View>
        <View>
          <Text className="text-[#6B7280] font-semibold">Số lượng</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập số lượng"
            onChangeText={(text) => setInputForm({ ...inputForm, quantity: Number(text) })}
            value={inputForm.quantity + ''}
          />
        </View>
        <View>
          <Text className="text-[#6B7280] font-semibold">Số chương</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập số chương"
            onChangeText={(text) => setInputForm({ ...inputForm, numberChapter: Number(text) })}
            value={inputForm.numberChapter + ''}
          />
        </View>
        <View>
          <Text className="text-[#6B7280] font-semibold">Số trang</Text>
          <TextInput
            className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
            placeholder="Nhập số trang"
            onChangeText={(text) => setInputForm({ ...inputForm, numberPage: Number(text) })}
            value={inputForm.numberPage + ''}
          />
        </View>
        <TouchableOpacity
          onPress={pickImage}
          className="border-dashed border h-[172px] rounded-[20px] mt-8 flex items-center justify-center"
        >
          {inputForm.thumbnail ? (
            <Image
              source={{ uri: inputForm.thumbnail }}
              className="h-[140px] w-[90px] rounded-[8px]"
            />
          ) : (
            <View className="flex items-center justify-center flex-col">
              <MaterialCommunityIcons name="image-plus" size={48} color="#EE4F1C" />
              <Text className="mt-2 font-semibold text-[#6B7280]">Tải lên hình ảnh sách</Text>
            </View>
          )}
        </TouchableOpacity>
        <CustomButton
          title="Thêm sách"
          onPress={onSubmitSellBook}
          containerStyle={`w-full mt-7 mb-2 bg-[#EE4F1C] min-h-[48px] ${isDisabledSubmit && 'bg-gray-300'}`}
          textStyle="text-white"
          disabled={isDisabledSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})
