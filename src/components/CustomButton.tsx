import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'

type Props = {
  title: string
  containerStyle?: string
  textStyle?: string
  isLoading?: boolean
} & TouchableOpacityProps

const CustomButton = ({
  title,
  containerStyle = '',
  textStyle = '',
  isLoading,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`bg-[#EE4F1C] rounded-xl min-h-[48px] justify-center 
          items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
      {...props}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
