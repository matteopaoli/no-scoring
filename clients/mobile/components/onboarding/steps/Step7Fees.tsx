import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useOnboarding } from '../OnboardingContext';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const Step7Fees: React.FC = () => {
  const { userInfo, dispatch } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handleFeeSelection = useCallback(
    (customerPaysFees: boolean) => {
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, customerPaysFees },
      });
    },
    [dispatch, userInfo]
  );

  const feeOptions = [
    {
      label: 'Addebita le commissioni al cliente',
      subtext: '(Il prezzo visualizzato includerà i costi di servizio)',
      value: true,
    },
    {
      label: 'Assorbi le commissioni nel tuo prezzo',
      subtext: "Riceverai il pagamento dopo aver dedotto i costi di servizio",
      value: false,
    },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Commissioni di Servizio</Text>
      <Text style={styles.stepDescription}>
        Le commissioni di servizio (2%) coprono i costi di pagamento e manutenzione della piattaforma.
      </Text>

      {feeOptions.map(({ label, subtext, value }) => {
        const selected = userInfo.customerPaysFees === value;
        return (
          <TouchableOpacity
            key={`${value}`}
            style={styles.feeOption}
            onPress={() => handleFeeSelection(value)}
          >
            <View style={styles.radioButton}>
              <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.feeOptionText}>
                {label}
                {'\n'}
                <Text style={styles.feeOptionSubtext}>{subtext}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        );
    })}
    <OnboardingNavigation />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create<{
    stepContainer: ViewStyle;
    stepTitle: TextStyle;
    stepDescription: TextStyle;
    feeOption: ViewStyle;
    radioButton: ViewStyle;
    radioOuter: ViewStyle;
    radioOuterSelected: ViewStyle;
    radioInner: ViewStyle;
    feeOptionText: TextStyle;
    feeOptionSubtext: TextStyle;
  }>({
    stepContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      margin: 20,
      marginTop: 150,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    stepTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: theme.fontSize,
    },
    stepDescription: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
      marginBottom: theme.fontSize * 1.5,
      textAlign: 'center',
    },
    feeOption: {
      marginBottom: theme.fontSize,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioOuter: {
      width: theme.fontSize * 1.5,
      height: theme.fontSize * 1.5,
      borderRadius: (theme.fontSize * 1.5) / 2,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.fontSize / 2,
    },
    radioOuterSelected: {
      borderColor: theme.primary,
    },
    radioInner: {
      width: theme.fontSize * 0.8,
      height: theme.fontSize * 0.8,
      borderRadius: (theme.fontSize * 0.8) / 2,
      backgroundColor: theme.primary,
    },
    feeOptionText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      lineHeight: theme.fontSize * 1.4,
    },
    feeOptionSubtext: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      color: theme.subtext,
    },
  });

export default Step7Fees;
