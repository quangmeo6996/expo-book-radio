import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemBook from '@/components/ItemBook'
import { IQueryOptions, queryDocuments } from '@/firebase/api'
import { IBook, IWishList } from '@/types/book'
import { useIsFocused } from '@react-navigation/core'
import { useAppSelector } from '@/redux'
import { EQueryOperator } from '@/firebase/type'

const Favourite = () => {
  const user = useAppSelector((state) => state.user.user)
  const isFocus = useIsFocused()
  const [listDataFavourite, setListDataFavourite] = useState<IBook[]>([])

  useEffect(() => {
    const renderData = async () => {
      const queryOptions: IQueryOptions = {
        property: 'userId',
        queryOperator: EQueryOperator.EQUAL,
        value: user?.id,
      }
      const wishLists = await queryDocuments<IWishList[]>('wishlist', queryOptions)
      const listBookId = wishLists?.map((book) => book.bookId)
      if (listBookId && listBookId.length > 0) {
        const listBooks = await queryDocuments<IBook[]>('book-radio', {
          property: 'id',
          queryOperator: EQueryOperator.IN,
          value: listBookId,
        })
        setListDataFavourite(listBooks!)
      }
    }
    renderData()
    return () => {
      setListDataFavourite([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus])

  return (
    <SafeAreaView className="bg-white pb-6 flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-row flex justify-center items-center pb-2 border-b border-b-[#D1D5DB] mb-4">
        <Text className="font-medium text-xl">Yêu thích</Text>
      </View>
      {listDataFavourite && listDataFavourite?.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false} className="mb-2 mx-4">
          <View className="flex flex-wrap flex-row gap-2 justify-between">
            {listDataFavourite.map((item) => (
              <View key={item.id}>
                <ItemBook type="play" data={item} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Favourite
