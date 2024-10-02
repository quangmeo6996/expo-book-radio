import { FlatList, View } from 'react-native'
import ItemBookMarket from '@/components/ItemBookMarket'
import React, { useCallback, useState } from 'react'
import { IBook, IPurchaseBook } from '@/types/book'
import { IQueryOptions, queryDocuments } from '@/firebase/api'
import { EQueryOperator } from '@/firebase/type'
import { useAppSelector } from '@/redux'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { useFocusEffect } from 'expo-router'

export default function BuyTab() {
  const user = useAppSelector((state) => state.user.user)

  const [bookPurchased, setBookPurchased] = useState<IBook[] | null>(null)

  const fetchBooks = useCallback(async () => {
    const queryOptions: IQueryOptions = {
      property: 'userId',
      queryOperator: EQueryOperator.EQUAL,
      value: user?.id,
    }
    const listPurchased = await queryDocuments<IPurchaseBook[]>('purchases', queryOptions)
    console.log('🚀 ~ fetchBooks ~ listPurchased:', listPurchased)
    const listBookId = listPurchased?.map((item) => item.bookId)

    if (listBookId && listBookId.length > 0) {
      const listBooks = await queryDocuments<IBook[]>('book-radio', {
        property: 'id',
        queryOperator: EQueryOperator.IN,
        value: listBookId,
      })
      setBookPurchased(listBooks)
    } else {
      setBookPurchased([])
    }
  }, [user?.id])

  useFocusEffect(
    useCallback(() => {
      fetchBooks()
    }, [fetchBooks]),
  )

  // useEffect(() => {
  //   const fetchBooks = async () => {
  //     const queryOptions: IQueryOptions = {
  //       property: 'userId',
  //       queryOperator: EQueryOperator.EQUAL,
  //       value: user?.id,
  //     }
  //     const listPurchased = await queryDocuments<IPurchaseBook[]>('purchases', queryOptions)
  //     console.log('🚀 ~ fetchBooks ~ listPurchased:', listPurchased)
  //     const listBookId = listPurchased?.map((item) => item.bookId)

  //     if (listBookId && listBookId.length > 0) {
  //       const listBooks = await queryDocuments<IBook[]>('book-radio', {
  //         property: 'id',
  //         queryOperator: EQueryOperator.IN,
  //         value: listBookId,
  //       })
  //       setBookPurchased(listBooks)
  //     } else {
  //       setBookPurchased([])
  //     }
  //   }
  //   fetchBooks()
  // }, [user?.id])
  return (
    <View className="flex-1">
      {bookPurchased ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={bookPurchased}
          renderItem={(item) => <ItemBookMarket data={item.item} onPress={() => {}} />}
        />
      ) : (
        <LoadingAnimation />
      )}
    </View>
  )
}
