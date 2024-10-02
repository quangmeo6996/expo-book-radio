import { FlatList, View } from 'react-native'
import ItemBookMarket from '@/components/ItemBookMarket'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { IBook, ISellBook } from '@/types/book'
import { useAppSelector } from '@/redux'
import { IQueryOptions, queryDocuments } from '@/firebase/api'
import { EQueryOperator } from '@/firebase/type'
import { LoadingAnimation } from '@/components/LoadingAnimation'


export default function CellTab() {
  const user = useAppSelector((state) => state.user.user)

  const [bookSell, setBookSell] = useState<ISellBook[] | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      const queryOptions: IQueryOptions = {
        property: 'userId',
        queryOperator: EQueryOperator.EQUAL,
        value: user!.id,
      }
      const listPurchased = await queryDocuments<ISellBook[]>('sells', queryOptions)
      setBookSell(listPurchased)
    }
    fetchBooks()
  }, [user])
  return (
    <View className="flex-1">
      {bookSell ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          data={bookSell}
          renderItem={(item) => <ItemBookMarket data={item.item.bookInfo} onPress={() => {}} />}
        />
      ) : (
        <LoadingAnimation />
      )}
      <CustomButton
        title="Thêm sách"
        onPress={() => router.push('/detail-buy')}
        containerStyle="w-full mt-7 mb-2 bg-[#EE4F1C] min-h-[48px]"
        textStyle="text-white"
      />
    </View>
  )
}
