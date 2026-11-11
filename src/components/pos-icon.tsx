import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type IconName =
  | 'dashboard'
  | 'shopping-cart'
  | 'users'
  | 'dollar-sign'
  | 'bar-chart'
  | 'box'
  | 'alert-triangle'
  | 'truck'
  | 'settings'
  | 'search'
  | 'menu'
  | 'bell'
  | 'message-square'
  | 'maximize'
  | 'grid'
  | 'chevron-down'
  | 'chevron-right'
  | 'log-out'
  | 'download'
  | 'plus'
  | 'package'
  | 'trending-up'
  | 'trending-down'
  | 'clock'
  | 'circle';

interface PosIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const PosIcon: React.FC<PosIconProps> = ({
  name,
  size = 18,
  color = '#94A3B8',
  style,
}) => {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {renderIconGlyph(name, size, color)}
    </View>
  );
};

function renderIconGlyph(name: IconName, size: number, color: string) {
  switch (name) {
    case 'dashboard':
      return (
        <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 1 }}>
          <View style={{ width: (size - 6) / 2, height: (size - 6) / 2, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: (size - 6) / 2, height: (size - 6) / 2, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: (size - 6) / 2, height: (size - 6) / 2, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: (size - 6) / 2, height: (size - 6) / 2, backgroundColor: color, borderRadius: 2 }} />
        </View>
      );
    case 'shopping-cart':
      return (
        <View style={{ width: size, height: size, justifyContent: 'center' }}>
          <View style={{ width: size * 0.8, height: size * 0.5, borderWidth: 1.5, borderColor: color, borderRadius: 2, borderBottomLeftRadius: 3 }} />
          <View style={{ flexDirection: 'row', gap: 3, marginTop: 1, paddingLeft: 2 }}>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: color }} />
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: color }} />
          </View>
        </View>
      );
    case 'users':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.2, borderWidth: 1.5, borderColor: color }} />
          <View style={{ width: size * 0.7, height: size * 0.3, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, marginTop: 1 }} />
        </View>
      );
    case 'dollar-sign':
      return (
        <Text style={{ fontSize: size * 0.9, fontWeight: '700', color, lineHeight: size }}>$</Text>
      );
    case 'bar-chart':
      return (
        <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
          <View style={{ width: 2.5, height: size * 0.4, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2.5, height: size * 0.75, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2.5, height: size * 0.55, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2.5, height: size * 0.9, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    case 'box':
    case 'package':
      return (
        <View style={{ width: size * 0.75, height: size * 0.75, borderWidth: 1.5, borderColor: color, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '100%', height: 1, backgroundColor: color }} />
        </View>
      );
    case 'alert-triangle':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.75, color, fontWeight: '900', lineHeight: size }}>⚠</Text>
        </View>
      );
    case 'truck':
      return (
        <View style={{ width: size * 0.85, height: size * 0.55, borderWidth: 1.5, borderColor: color, borderRadius: 2, flexDirection: 'row' }}>
          <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: color }} />
          <View style={{ flex: 1 }} />
        </View>
      );
    case 'settings':
      return (
        <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size * 0.4, borderWidth: 2, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.2, backgroundColor: color }} />
        </View>
      );
    case 'search':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.55, height: size * 0.55, borderRadius: size * 0.3, borderWidth: 1.5, borderColor: color }} />
          <View style={{ width: 1.5, height: size * 0.3, backgroundColor: color, transform: [{ rotate: '-45deg' }], position: 'absolute', right: 2, bottom: 2 }} />
        </View>
      );
    case 'menu':
      return (
        <View style={{ width: size, height: size, justifyContent: 'center', gap: 3 }}>
          <View style={{ width: size * 0.85, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: size * 0.85, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: size * 0.85, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    case 'bell':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.6, height: size * 0.6, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 1.5, borderColor: color }} />
          <View style={{ width: size * 0.8, height: 1.5, backgroundColor: color }} />
          <View style={{ width: 3, height: 2, backgroundColor: color, borderRadius: 1, marginTop: 1 }} />
        </View>
      );
    case 'message-square':
      return (
        <View style={{ width: size * 0.8, height: size * 0.65, borderWidth: 1.5, borderColor: color, borderRadius: 3 }}>
          <View style={{ position: 'absolute', bottom: -3, left: 3, width: 4, height: 4, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
        </View>
      );
    case 'maximize':
      return (
        <View style={{ width: size * 0.75, height: size * 0.75, borderWidth: 1.5, borderColor: color, borderRadius: 2 }} />
      );
    case 'grid':
      return (
        <View style={{ width: size * 0.8, height: size * 0.8, flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
          <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    case 'chevron-down':
      return (
        <View style={{ width: 6, height: 6, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }] }} />
      );
    case 'chevron-right':
      return (
        <View style={{ width: 6, height: 6, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }] }} />
      );
    case 'log-out':
      return (
        <View style={{ width: size * 0.8, height: size * 0.8, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: size * 0.45, height: size * 0.7, borderWidth: 1.5, borderColor: color, borderRightWidth: 0, borderRadius: 2 }} />
          <View style={{ width: size * 0.35, height: 1.5, backgroundColor: color }} />
        </View>
      );
    case 'download':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 1.5, height: size * 0.5, backgroundColor: color }} />
          <View style={{ width: 5, height: 5, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }], marginTop: -3 }} />
          <View style={{ width: size * 0.7, height: 1.5, backgroundColor: color, marginTop: 3 }} />
        </View>
      );
    case 'plus':
      return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.7, height: 2, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: 2, height: size * 0.7, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
        </View>
      );
    case 'circle':
    default:
      return (
        <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: color }} />
      );
  }
}

