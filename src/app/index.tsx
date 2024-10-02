import { Redirect, router } from 'expo-router'
import { View } from 'react-native'
import { useAppDispatch, useAppSelector } from '@/redux'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IUser, setUser } from '@/redux/userSlice'
import { removeLoading, setLoading } from '@/redux/loadingSlice'
import { ERouteTable } from '@/constants/route-table'
import { getOneDocument } from '@/firebase/api'

export default function App() {
  // NOTE: Change logic
  const { user } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getUser = async () => {
      dispatch(setLoading())
      const uid = await AsyncStorage.getItem('userId')

      if (uid) {
        const userInfo = await getOneDocument<IUser>('users', uid)
        dispatch(setUser(userInfo as IUser))
        router.push(ERouteTable.HOME)
      }
      dispatch(removeLoading())
    }
    getUser()
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <View className="flex-1">
        {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/sign-in" />}
      </View>
    </>
  )
}
