import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
  id: string
  email: string | null
  username: string | null
  avatar?: string | null
  avatarName?: string | null
  phone?: string | null
  password: string
}

type UserState = {
  user: IUser | null
}

const initialState: UserState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload
    },
    removeUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer
