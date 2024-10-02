import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import ItemBook from '@/components/ItemBook'
import { IBook } from '@/types/book'
import { getAllDocuments } from '@/firebase/api'
import { getRandomArray } from '@/utils/common'

const Search = () => {
  const [search, setSearch] = React.useState('')
  const [allBook, setAllBook] = useState<IBook[] | null>(null)
  const [displayBook, setDisplayBook] = useState<IBook[]>([])
  const [lastSearched, setLastSearched] = useState('')

  const getAllBook = async () => {
    const list: IBook[] | null = await getAllDocuments('book-radio')
    setAllBook(list)
    setDisplayBook(getRandomArray(list!, 5))
  }
  useEffect(() => {
    getAllBook()
  }, [])

  const queryBook = () => {
    if (!allBook || search === lastSearched) return

    if (search.trim() === '') {
      setDisplayBook(getRandomArray(allBook, 5))
    } else {
      const filteredBooks = allBook.filter((book) =>
        book.name.toLowerCase().includes(search.toLowerCase()),
      )
      setDisplayBook(filteredBooks)
    }
    setLastSearched(search)
  }

  return (
    <TouchableWithoutFeedback onPress={queryBook}>
      <SafeAreaView className="bg-white h-full relative flex-1">
        <View className="flex-row w-full items-center gap-2 mx-4 flex">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            className="border w-[80%] p-3 border-gray-300 rounded-2xl"
            placeholder="Tìm kiếm"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <View className="mx-4 mt-4">
          <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
            <View className="flex flex-wrap flex-row gap-2 justify-between">
              {displayBook.map((item) => (
                <View key={item.id}>
                  <ItemBook type="play" data={item} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default Search
