import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import HeaderComponent from '@/components/HeaderComponent'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { formatCurrencyVND } from '@/utils/formatCurrency'
import { IBook, IPurchaseBook } from '@/types/book'
import { addDocument, getOneDocument } from '@/firebase/api'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { useAppSelector } from '@/redux'

export default function DetailBuyBook() {
  const user = useAppSelector((state) => state.user.user)
  const params = useLocalSearchParams<{ bookId: string }>()
  const { bookId } = params

  const [book, setBook] = useState<IBook | null>(null)

  useEffect(() => {
    const fetchBookDetail = async () => {
      const data = await getOneDocument<IBook>('book-radio', bookId!)
      setBook(data)
    }

    fetchBookDetail()
  }, [bookId])

  const [inputForm, setInputForm] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: '1',
  })

  const isDisabledSubmit =
    !inputForm.phone || !inputForm.name || !inputForm.address || !inputForm.quantity

  const onSubmit = async () => {
    const dataPurchaseBook: IPurchaseBook = {
      bookId: bookId!,
      userId: user!.id,
      userName: inputForm.name,
      phone: inputForm.phone,
      address: inputForm.address,
      quantity: Number(inputForm.quantity),
      deliveryStatus: 'PROCESSING',
    }

    try {
      await addDocument('purchases', null, dataPurchaseBook)
      router.back()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView
      className="bg-white h-full relative flex-1"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      {book ? (
        <View className="mx-4 flex-1">
          <HeaderComponent
            title={'Thông tin mua sách'}
            iconLeft={
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
            }
          />
          <View className="flex-1 mt-3">
            <View className="pb-2 border-b border-b-[#D1D5DB]">
              <Text>Trương Học Vĩ</Text>
              <Text className="text-base font-semibold mt-0.5">{book.name}</Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-sm font-semibold text-[#6B7280]">Tổng</Text>
              <Text className="text-[#EE4F1C] text-lg font-semibold">
                {formatCurrencyVND(book.price)}
              </Text>
            </View>
            <View className="mt-8">
              <Text className="text-[#6B7280] font-semibold">Họ tên</Text>
              <TextInput
                className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
                placeholder="Nhập họ tên"
                onChangeText={(text) => setInputForm({ ...inputForm, name: text })}
                value={inputForm.name}
              />
            </View>

            <View className="mt-2">
              <Text className="text-[#6B7280] font-semibold">Số điện thoại</Text>
              <TextInput
                className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
                placeholder="Số điện thoại"
                onChangeText={(text) => setInputForm({ ...inputForm, phone: text })}
                value={inputForm.phone}
              />
            </View>

            <View className="mt-2">
              <Text className="text-[#6B7280] font-semibold">Địa chỉ nhận hàng</Text>
              <TextInput
                className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
                placeholder="Nhập địa chỉ nhận hàng"
                onChangeText={(text) => setInputForm({ ...inputForm, address: text })}
                value={inputForm.address}
              />
            </View>

            <View className="mt-2">
              <Text className="text-[#6B7280] font-semibold">Số lượng</Text>
              <TextInput
                className="border my-2 h-[50px] p-3 border-gray-300 rounded-2xl"
                placeholder="Số lượng"
                keyboardType="numeric"
                onChangeText={(text) => setInputForm({ ...inputForm, quantity: text })}
                value={inputForm.quantity}
              />
            </View>
          </View>
          <CustomButton
            title="Gửi"
            onPress={onSubmit}
            disabled={isDisabledSubmit}
            containerStyle={`${isDisabledSubmit && 'bg-gray-300'}`}
          />
        </View>
      ) : (
        <LoadingAnimation />
      )}
    </SafeAreaView>
  )
}
