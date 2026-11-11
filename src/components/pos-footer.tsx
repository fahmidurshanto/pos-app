import React from 'react';
import { View, Text } from 'react-native';

export const PosFooter: React.FC = () => {
  return (
    <View className="py-6 px-4 border-t border-slate-200 mt-4 flex-row items-center justify-between">
      <Text className="text-slate-400 text-xs">
        Copyright © 2026{' '}
        <Text className="text-[#3B82F6] font-medium">bditpark.com</Text>. All
        rights reserved.
      </Text>
      <Text className="text-slate-400 text-xs font-mono">Version 1.0.0</Text>
    </View>
  );
};

