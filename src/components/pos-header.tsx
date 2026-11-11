import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PosIcon } from '@/components/pos-icon';

interface PosHeaderProps {
  onOpenSidebar: () => void;
}

export const PosHeader: React.FC<PosHeaderProps> = ({ onOpenSidebar }) => {
  return (
    <View className="bg-white px-4 py-3 border-b border-slate-200 flex-row items-center justify-between shadow-sm">
      {/* Left: Hamburger menu & Links */}
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onOpenSidebar}
          className="p-2 rounded-lg bg-slate-100 active:bg-slate-200">
          <PosIcon name="menu" size={18} color="#334155" />
        </Pressable>
        <Text className="text-slate-700 font-medium text-sm">Home</Text>
        <Text className="text-slate-400 font-medium text-sm">Contact</Text>
      </View>

      {/* Right: Quick actions */}
      <View className="flex-row items-center gap-2.5">
        <Pressable className="p-1.5 rounded-full hover:bg-slate-100">
          <PosIcon name="search" size={16} color="#64748B" />
        </Pressable>

        <Pressable className="p-1.5 rounded-full relative">
          <PosIcon name="message-square" size={16} color="#64748B" />
          <View className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-[9px] font-bold text-white">2</Text>
          </View>
        </Pressable>

        <Pressable className="p-1.5 rounded-full relative">
          <PosIcon name="bell" size={16} color="#64748B" />
          <View className="absolute -top-0.5 -right-0.5 bg-amber-500 rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-[9px] font-bold text-white">15</Text>
          </View>
        </Pressable>

        <Pressable className="p-1.5 rounded-full">
          <PosIcon name="maximize" size={14} color="#64748B" />
        </Pressable>

        <Pressable className="p-1.5 rounded-full">
          <PosIcon name="grid" size={14} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
};

