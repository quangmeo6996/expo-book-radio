import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BuyTab from '@/market-tab/BuyTab'
import CellTab from '@/market-tab/CellTab'

const Market = () => {
  const [activeTab, setActiveTab] = useState('buy')

  const renderTab = () => {
    switch (activeTab) {
      case 'buy':
        return <BuyTab />
      default:
        return <CellTab />
    }
  }

  return (
    <SafeAreaView className="bg-white pb-6 flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
      <Text className="text-xl font-semibold text-center mb-2">Mua & bán</Text>
      <View className="bg-[#F3F4F6] h-[48px] w-full py-2 px-4">
        <View className="bg-[#e4e7eb] w-full h-[32px] rounded-[10px] flex-row p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('buy')}
            className={`w-[50%] flex justify-center items-center ${activeTab === 'buy' ? 'bg-white rounded-[10px]' : ''}`}
          >
            <Text>Mua</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('cell')}
            className={`w-[50%] flex justify-center items-center ${activeTab === 'cell' ? 'bg-white rounded-[10px]' : ''}`}
          >
            <Text>Bán</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mx-4 mt-2 flex-1">{renderTab()}</View>
    </SafeAreaView>
  )
}

export default Market
