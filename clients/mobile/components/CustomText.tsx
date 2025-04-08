import { useAppTheme } from '@/contexts/ThemeContext';
import React, { ReactNode } from 'react';
import {
  Text,
  TextProps,
  StyleProp,
  TextStyle,
} from 'react-native';

interface CustomTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function CustomText({
  children,
  style,
  ...props
}: CustomTextProps) {
  const theme = useAppTheme(); // Access the current theme
  return (
    <Text
      style={[
        { fontSize: theme.fontSize, fontFamily: theme.fontRegular },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
