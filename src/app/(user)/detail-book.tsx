import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import HeaderComponent from '@/components/HeaderComponent'
import { AntDesign, EvilIcons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { images } from '@/constants'
import StarRating from '@/components/StarRating'
import { formatCurrencyVND } from '@/utils/formatCurrency'
import CustomButton from '@/components/CustomButton'
import TrackPlayer from 'react-native-track-player'
import { categoryArray, IBook, IComment } from '@/types/book'
import {
  addDocument,
  deleteDocument,
  getAllDocuments,
  getOneDocument,
  IQueryOptions,
  queryDocuments,
} from '@/firebase/api'
import { EQueryOperator } from '@/firebase/type'
import { useAppSelector } from '@/redux'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { useQueue } from '@/store/queue'
import { IUser } from '@/redux/userSlice'

const CommentCard = ({
  userInfo,
  rating,
  comment,
}: {
  userInfo?: IUser
  rating: number
  comment: string
}) => {
  return (
    <View className="flex flex-row gap-2 border-b pb-2 border-b-[#E5E7EB] mt-1">
      <Image
        source={userInfo?.avatar ? { uri: userInfo?.avatar } : images.logoApp}
        className="w-full max-w-[40px] h-[40px] rounded-full"
        resizeMode="contain"
      />
      <View>
        <Text className="font-semibold mb-0.5">{userInfo?.username || 'Anonymous'}</Text>
        <StarRating ratingValue={rating} disabled={true} size={12} />
        <Text className="mt-0.5">{comment}</Text>
      </View>
    </View>
  )
}

export default function DetailBook() {
  const [activeHeart, setActiveHeart] = React.useState(false)
  const [showALL, setShowAll] = useState(false)

  const user = useAppSelector((state) => state.user.user)

  const params = useLocalSearchParams<{ bookId: string }>()
  const { bookId } = params
  const [listComment, setListComment] = useState<IComment[]>([])
  const [book, setBook] = useState<any | null>(null)
  const [isCommented, setIsCommented] = useState(false)

  const [listDataHome, setListDataHome] = useState<any[]>([])

  const [listDataWishList, setListDataWishList] = useState<any[]>([])

  const queueOffset = useRef(0)
  const { activeQueueId, setActiveQueueId } = useQueue()

  useEffect(() => {
    const renderData = async () => {
      const a: IBook[] | null = await getAllDocuments('book-radio')
      if (a) {
        setListDataHome(a.filter((item) => item.typeBook === 'RADIO'))
      }
      const b: any[] | null = await getAllDocuments('wishlist')
      if (b) {
        setListDataWishList(b)
      }
    }
    renderData()
  }, [activeHeart])

  const togglePlayPause = async () => {
    if (!book) return // Ensure `book` is not null
    const trackIndex = listDataHome.findIndex((track) => track.url === book.url)

    console.log(trackIndex, '---vtrackIndex')
    if (trackIndex === -1) return

    const isChangingQueue = book.id !== activeQueueId

    if (isChangingQueue) {
      const beforeTracks = listDataHome.slice(0, trackIndex)
      const afterTracks = listDataHome.slice(trackIndex + 1)

      await TrackPlayer.reset()

      // we construct the new queue
      await TrackPlayer.add(book)
      await TrackPlayer.add(afterTracks)
      await TrackPlayer.add(beforeTracks)

      await TrackPlayer.play()

      queueOffset.current = trackIndex
      setActiveQueueId(book.id)
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? listDataHome.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current

      await TrackPlayer.skip(nextTrackIndex)
      TrackPlayer.play()
    }
    router.push('/music-screen')
  }

  useFocusEffect(
    useCallback(() => {
      const fetchBookDetail = async () => {
        console.log('🚀 ~ fetchBookDetail ~ bookId:', bookId)
        const data = await getOneDocument<IBook>('book-radio', bookId!)
        console.log('🚀 ~ fetchBookDetail ~ data:', data)
        setBook(data)
      }
      const fetchAllComment = async () => {
        const queryOptions: IQueryOptions = {
          property: 'bookId',
          queryOperator: EQueryOperator.EQUAL,
          value: bookId,
        }

        const list: IComment[] | null = await queryDocuments('comments', queryOptions)
        console.log('🚀 ~ fetchAllComment ~ list:', list)

        if (list) {
          const commentsWithUserInfo = await Promise.all(
            list.map(async (comment) => {
              const userInfo = await getOneDocument<any>('users', comment.userId)
              return { ...comment, userInfo }
            }),
          )
          setListComment(commentsWithUserInfo)

          const isCheck = list.some((comment) => comment.userId === user!.id)
          setIsCommented(isCheck)
        }
      }

      fetchBookDetail()
      fetchAllComment()
    }, [bookId, user]),
  )

  const handleAddToWishList = async () => {
    if (!activeHeart) {
      const dataSubmit: any = {
        bookId: book?.id,
        userId: user?.id,
      }
      await addDocument('wishlist', null, dataSubmit)
      setActiveHeart(!activeHeart)
    } else {
      const a = listDataWishList.filter((item) => item.bookId === book?.id)
      if (a && a.length > 0) {
        await deleteDocument('wishlist', a[0].id)
        setActiveHeart(!activeHeart)
      }
    }
  }

  useEffect(() => {
    if (listDataWishList && listDataWishList?.length > 0) {
      const listCheckHeart = listDataWishList.filter((item) => item.userId === user?.id)
      if (listCheckHeart && listCheckHeart.length > 0) {
        const check = listCheckHeart.some((item) => item.bookId === book?.id)
        if (check) {
          setActiveHeart(true)
        }
      }
    }
  }, [listDataWishList, user, book])

  return (
    <SafeAreaView
      className="bg-white h-full relative flex-1"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      <View className="mx-4 flex-1">
        <HeaderComponent
          title="Thông tin sách"
          iconLeft={
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="#1F2937" />
            </TouchableOpacity>
          }
          iconRight={
            <TouchableOpacity onPress={handleAddToWishList}>
              <MaterialCommunityIcons
                name="cards-heart-outline"
                size={24}
                color={activeHeart ? 'red' : '#1F2937'}
              />
            </TouchableOpacity>
          }
        />
        {book ? (
          <>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="bg-[#EE4F1C1A] h-[346px] p-2 rounded-[20px] mt-[100px] relative items-center flex flex-col">
                <Image
                  source={{ uri: book.thumbnail }}
                  className="w-[176px] h-[250px] top-[-80px] rounded-[20px]"
                />
                <Text className="text-center top-[-70px] text-xl font-semibold text-[#EE4F1C] max-w-[70%]">
                  {book.name}
                </Text>
                <Text className="text-center top-[-65px]">{book.author}</Text>
                <Text className="text-center top-[-58px] font-bold">
                  Thể loại: {categoryArray.find((cat) => cat.value === book.category)?.label}
                </Text>
                <View className="flex flex-row justify-between top-[-50px]">
                  <View className="flex flex-col items-center">
                    <View className="flex flex-row items-center">
                      <Text className="text-xl font-semibold ml-1">{book.rating || 0}</Text>
                      <MaterialIcons name="star-rate" size={16} color="#EE4F1C" />
                    </View>
                    <Text className="text-xs">Đánh giá</Text>
                  </View>
                  <View className="flex flex-col items-center mx-12">
                    <Text className="text-xl font-semibold ml-1">{book.numberChapter}</Text>
                    <Text className="text-xs">Chương</Text>
                  </View>
                  <View className="flex flex-col items-center">
                    <Text className="text-xl font-semibold ml-1">{book.numberPage}</Text>
                    <Text className="text-xs">Trang</Text>
                  </View>
                </View>
              </View>
              {book.typeBook === 'RADIO' && (
                <View className="flex-row flex items-center bg-[#EE4F1C1A] mt-4 rounded-[16px] px-[12px] py-2">
                  <TouchableOpacity onPress={togglePlayPause}>
                    <AntDesign name="play" size={24} color="#EE4F1C" />
                  </TouchableOpacity>
                  <View className="ml-2">
                    <Text className="font-semibold">{book.name}</Text>
                    <Text className="text-xs">{book.author}</Text>
                  </View>
                </View>
              )}
              <Text className="font-semibold mt-4 mb-0.5 text-lg">Mô tả</Text>
              <View>
                <Text numberOfLines={!showALL ? 4 : undefined}>{book.description}</Text>
                <TouchableOpacity onPress={() => setShowAll(!showALL)}>
                  <Text className="text-[#1E40AF] mt-0.5">{!showALL ? 'Xem thêm' : 'Thu gọn'}</Text>
                </TouchableOpacity>
              </View>
              <Text className="font-semibold mt-4 mb-0.5 text-lg">Đánh giá cuốn sách này</Text>
              <View className="flex flex-row justify-between mt-2 items-center">
                <View className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((elm) => (
                    <EvilIcons key={elm} name="star" size={24} color="#EE4F1C" />
                  ))}
                </View>
                <TouchableOpacity
                  className={`p-2 border rounded-[10px]  ${isCommented ? 'border-green-600' : 'border-[#EE4F1C]'}`}
                  onPress={() =>
                    router.push({ pathname: '/evaluate-screen', params: { bookId: book.id } })
                  }
                  disabled={isCommented}
                >
                  <Text className={`${isCommented ? 'text-green-600' : 'text-[#EE4F1C]'}`}>
                    {isCommented ? 'Đã đánh giá' : 'Viết đánh giá'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="font-semibold mt-4 mb-0.5 text-lg">Đánh giá & nhận xét</Text>
              {listComment.map((item, index) => (
                <View key={index}>
                  <CommentCard
                    userInfo={item.userInfo}
                    rating={item.rating}
                    comment={item.comment}
                  />
                </View>
              ))}
            </ScrollView>
            <View className="flex flex-row justify-between py-2">
              <View>
                <Text className="text-[#6B7280]">Giá</Text>
                <Text className="font-semibold text-xl">{formatCurrencyVND(book.price)}</Text>
              </View>
              <CustomButton
                title={'Mua ngay'}
                containerStyle="px-2"
                onPress={() =>
                  router.push({ pathname: '/detail-buybook', params: { bookId: book.id } })
                }
              />
            </View>
          </>
        ) : (
          <LoadingAnimation />
        )}
      </View>
    </SafeAreaView>
  )
}
