import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '@/contexts/ThemeContext';

type BackgroundShapesProps = {
  theme: Theme;
  variant: 1 | 2 | 3;
};

export function BackgroundShapes({ theme, variant }: BackgroundShapesProps) {
  switch (variant) {
    case 1:
      return (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.circle, { backgroundColor: `${theme.primary}33`, top: -50, left: -50, width: 150, height: 150, borderRadius: 75 }]} />
          <View style={[styles.circle, { backgroundColor: `${theme.secondary}44`, bottom: -80, right: -80, width: 220, height: 220, borderRadius: 110 }]} />
          <View style={[styles.blob, { backgroundColor: `${theme.primary}22`, top: 100, right: -70, width: 120, height: 120, borderRadius: 60, transform: [{ rotate: '45deg' }] }]} />
        </View>
      );
    case 2:
      return (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.circle, { backgroundColor: `${theme.secondary}33`, top: 20, right: -40, width: 130, height: 130, borderRadius: 65 }]} />
          <View style={[styles.blob, { backgroundColor: `${theme.primary}44`, bottom: 50, left: -60, width: 180, height: 180, borderRadius: 90, transform: [{ rotate: '-30deg' }] }]} />
          <View style={[styles.circle, { backgroundColor: `${theme.secondary}22`, top: 150, left: 50, width: 100, height: 100, borderRadius: 50 }]} />
        </View>
      );
    case 3:
      return (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.blob, { backgroundColor: `${theme.primary}33`, top: -30, right: -30, width: 160, height: 160, borderRadius: 80, transform: [{ rotate: '15deg' }] }]} />
          <View style={[styles.circle, { backgroundColor: `${theme.secondary}44`, bottom: -100, left: -100, width: 250, height: 250, borderRadius: 125 }]} />
          <View style={[styles.blob, { backgroundColor: `${theme.primary}22`, top: 180, left: 120, width: 110, height: 110, borderRadius: 55, transform: [{ rotate: '-60deg' }] }]} />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
  },
  blob: {
    position: 'absolute',
  },
});
