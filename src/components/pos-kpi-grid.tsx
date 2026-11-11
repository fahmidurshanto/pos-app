import React from 'react';
import { View, Text } from 'react-native';
import { PosIcon, IconName } from '@/components/pos-icon';
import { KPICardData } from '@/constants/pos-data';

export const PosKpiGrid: React.FC<{ cards: KPICardData[] }> = ({ cards }) => {
  return (
    <View className="flex-row flex-wrap gap-3">
      {cards.map((card) => {
        let iconName: IconName = 'package';
        if (card.id === 'stock-value') iconName = 'dollar-sign';
        if (card.id === 'low-stock') iconName = 'alert-triangle';
        if (card.id === 'out-of-stock') iconName = 'box';

        const isPositive = card.badgeType === 'positive';
        const isWarning = card.badgeType === 'warning';
        const isDanger = card.badgeType === 'danger';

        const subtitleColor = isPositive
          ? 'text-emerald-600'
          : isWarning
          ? 'text-amber-600'
          : 'text-rose-600';

        return (
          <View
            key={card.id}
            className="flex-1 min-w-[155px] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            {/* Top row: Icon box */}
            <View
              className="w-10 h-10 rounded-lg items-center justify-center mb-3"
              style={{ backgroundColor: card.iconBg }}>
              <PosIcon name={iconName} size={20} color={card.iconColor} />
            </View>

            {/* Label */}
            <Text className="text-slate-400 text-xs font-medium">
              {card.title}
            </Text>

            {/* Value */}
            <Text className="text-slate-900 text-2xl font-bold mt-1">
              {card.value}
            </Text>

            {/* Subtitle / delta */}
            <Text className={`text-xs font-medium mt-1 ${subtitleColor}`}>
              {card.subtitle}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

