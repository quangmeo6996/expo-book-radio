import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

interface IStarRating {
  maxStars?: number
  onRatingPress?: (rating: number) => void
  size?: number
  disabled?: boolean
  ratingValue?: number
}

const StarRating = ({
  maxStars = 5,
  onRatingPress,
  size = 30,
  disabled = false,
  ratingValue = 0,
}: IStarRating) => {
  const [rating, setRating] = useState(ratingValue)

  const handlePress = (star) => {
    setRating(star)
    if (onRatingPress) {
      onRatingPress(star)
    }
  }

  return (
    <View className="flex flex-row gap-2">
      {[...Array(maxStars)].map((_, index) => {
        return (
          <TouchableOpacity disabled={disabled} key={index} onPress={() => handlePress(index + 1)}>
            <FontAwesome
              name={index < rating ? 'star' : 'star-o'}
              size={size}
              color={index < rating ? '#EE4F1C' : '#EE4F1C'}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default StarRating
