import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderComponent from '@/components/HeaderComponent'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import StarRating from '@/components/StarRating'
import CustomButton from '@/components/CustomButton'
import { useAppSelector } from '@/redux'
import { addDocument, IQueryOptions, queryDocuments, updateDocument } from '@/firebase/api'
import { IComment } from '@/types/book'
import { EQueryOperator } from '@/firebase/type'

export default function EvaluateScreen() {
  const user = useAppSelector((state) => state.user.user)
  const params = useLocalSearchParams()
  const { bookId } = params as { bookId: string }
  const [rate, setRate] = useState(0)
  const [comment, setComment] = useState('')

  const handleRating = (rating: number) => {
    setRate(rating)
  }

  const handleUpdateRatingBook = async () => {
    // Get all comment from book
    const queryOptions: IQueryOptions = {
      property: 'bookId',
      queryOperator: EQueryOperator.EQUAL,
      value: bookId,
    }

    const listComment: IComment[] | null = await queryDocuments('comments', queryOptions)
    if (listComment) {
      const averageRating = listComment
        .reduce((result, currentComment) => {
          return result + currentComment.rating / listComment.length
        }, 0)
        .toFixed(2)
      await updateDocument('book-radio', bookId, {
        rating: averageRating,
      })
    }
  }

  const handleComment = async () => {
    const dataComment: IComment = {
      bookId: bookId,
      userId: user!.id,
      rating: rate,
      comment: comment,
    }
    try {
      await addDocument('comments', null, dataComment)
      await handleUpdateRatingBook()
      router.back()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className="mx-4 flex-1">
        <HeaderComponent
          title={'Đánh giá & Nhận xét'}
          iconLeft={
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="#1F2937" />
            </TouchableOpacity>
          }
        />
        <View className="items-center mt-12">
          <Text className="font-semibold text-base mb-4">Đánh giá</Text>
          <StarRating onRatingPress={handleRating} />
          <Text className="font-semibold text-base mb-2 mt-12">Nhận xét</Text>
        </View>
        <TextInput
          placeholder="Nhập nhận xét"
          multiline
          numberOfLines={4}
          onChangeText={setComment}
          className="border my-2 h-[100px] p-3 border-gray-300 rounded-2xl"
        />
        <CustomButton
          onPress={handleComment}
          title="Gửi"
          containerStyle="absolute w-full bottom-2"
        />
      </View>
    </SafeAreaView>
  )
}
