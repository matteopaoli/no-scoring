import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from './OnboardingContext';

interface OnboardingProgressProps {
  totalSteps?: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  totalSteps = 9,
}) => {
  const theme = useAppTheme();
  const { step } = useOnboarding();

  // Validate totalSteps and step
  const validTotalSteps = totalSteps > 0 ? totalSteps : 8;
  const validStep = step && step > 0 && step <= validTotalSteps ? step : 1;

  const dots = useMemo(
    () => Array.from({ length: validTotalSteps }, (_, idx) => idx + 1),
    [validTotalSteps]
  );

  // Get the dot style based on the step status
  const getDotStyle = (i: number): ViewStyle => {
    const isActive = i === validStep;
    const isCompleted = i < validStep;

    // Ensure that theme properties are valid and fallbacks are in place
    const fontSize = theme.fontSize || 14;
    const primary = theme.primary || '#000';  // Primary color (fallback to black)
    const text = theme.text || '#fff';
    const subtext = theme.subtext || '#ccc';

    // Determine opacity for each step
    const opacity = isActive
      ? 0.4  // Active step with 70% opacity
      : isCompleted
      ? 0.5  // Completed steps with 70% opacity (green color)
      : 0.1;  // Inactive steps with 30% opacity

    return {
      width: fontSize,  // Slightly larger for better visual impact
      height: fontSize,
      borderRadius: fontSize / 2,
      backgroundColor: isActive
        ? primary // Active step uses the primary color
        : isCompleted
        ? '#28a745' // Completed steps use a green color
        : subtext,  // Use the subtext color for inactive steps
      marginHorizontal: 5,  // Ensure some spacing between dots
      opacity,  // Apply the opacity here
    };
  };

  return (
    <View style={[styles.container, { gap: theme.fontSize || 14 }]}>
      {dots.map((i) => {
        const dotStyle = getDotStyle(i); // Apply memoized styles here
        return <View key={i} style={dotStyle} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingProgress;
