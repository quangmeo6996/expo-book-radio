import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="sign-in" options={{}} />
      <Stack.Screen name="sign-up" options={{}} />
      <Stack.Screen name="verify-account" options={{}} />
    </Stack>
  )
}
