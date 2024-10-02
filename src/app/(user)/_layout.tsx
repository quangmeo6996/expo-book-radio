import { Stack } from 'expo-router'

const UserScreenLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="search" options={{}} />
      <Stack.Screen name="book-play" options={{}} />
      <Stack.Screen name="detail-book" options={{}} />
      <Stack.Screen name="evaluate-screen" options={{}} />
      <Stack.Screen name="change-pasword" options={{}} />
      <Stack.Screen name="edit-profile" options={{}} />
      <Stack.Screen name="detail-buy" options={{}} />
      <Stack.Screen name="detail-buybook" options={{}} />
      <Stack.Screen name="music-screen" options={{}} />
    </Stack>
  )
}

export default UserScreenLayout
