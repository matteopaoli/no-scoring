import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Share,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Link, Share2, Check } from 'lucide-react-native';
import apiClient from '@/lib/httpClient';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Keyboard } from 'react-native';

export default function CreatePaymentLinkScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [amount, setAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCode, setQrCode] = useState('');

  const inputRef = useRef<TextInput>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [showSheet, setShowSheet] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  const openSheet = () => {
    setShowSheet(true);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowSheet(false));
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const animateInput = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAmountChange = (text: string) => {
    let clean = text.replace(',', '.').replace(/[^0-9.]/g, '');

    if (clean.startsWith('.')) clean = '0' + clean;
    if ((clean.match(/\./g) || []).length > 1) return;

    const [whole, decimal] = clean.split('.');
    if (decimal && decimal.length > 2) return;

    setAmount(clean);
    animateInput();
  };

  const formattedAmount = () => {
    if (!amount) return '0.00';
    if (amount.includes('.')) {
      const [whole, decimal] = amount.split('.');
      return `${whole || '0'}.${decimal.padEnd(2, '0')}`;
    }
    return `${amount}.00`;
  };

  const handleCreateLink = async () => {
    if (!amount) return;
    Keyboard.dismiss();
    try {
      const { data } = await apiClient.post('/payment/create', {
        price: parseFloat(amount),
      });

      setPaymentLink(data.paymentLink.url);
      setQrCode(data.qrCode);
      openSheet();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('Failed to create link', err);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Link di Pagamento',
        message: `Paga €${formattedAmount()} nel mio store: ${paymentLink}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
  <Text style={styles.title}>Inserisci l'importo</Text>

  <Animated.View style={[styles.amountBox, { transform: [{ scale: scaleAnim }] }]}>
    <Text style={styles.euro}>€</Text>
    <TextInput
      ref={inputRef}
      value={amount}
      onChangeText={handleAmountChange}
      keyboardType="decimal-pad"
      placeholder="0.00"
      placeholderTextColor={theme.subtext}
      selectionColor={theme.primary}
      style={styles.amountInput}
    />
  </Animated.View>

  <TouchableOpacity
    style={[styles.ctaButton, !amount && styles.disabled]}
    disabled={!amount}
    onPress={handleCreateLink}
  >
    <Text style={styles.ctaText}>Genera Link</Text>
    <Link size={20} color={theme.cardBackgroundColor} style={{ marginLeft: 8 }} />
  </TouchableOpacity>
</View>

      {showSheet && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSheet}
          style={styles.sheetOverlay}
        >
          <Animated.View
            style={[
              styles.sheetContainer,
              { transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            <View style={styles.successCircle}>
              <Check size={30} color="#28a745" />
            </View>
            <Text style={styles.successText}>Link creato</Text>
            <Text style={styles.modalAmount}>€{formattedAmount()}</Text>
            <Image source={{ uri: qrCode }} style={styles.qrCode} />
            <Text style={styles.linkText} numberOfLines={1}>
              {paymentLink}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryAction}
                onPress={() => router.push(paymentLink)}
              >
                <Text style={styles.primaryText}>Apri Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={handleShare}
              >
                <Share2 size={16} color={theme.primary} />
                <Text style={styles.secondaryText}>Condividi</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={closeSheet}>
              <Text style={styles.closeText}>Chiudi</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 45,
      height: 45,
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 22.5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
      marginBottom: 40,
    },
    currency: {
      fontSize: 48,
      fontFamily: theme.fontBold,
      color: theme.text,
      marginRight: 10,
    },
    input: {
      fontSize: 48,
      fontFamily: theme.fontBold,
      color: theme.text,
      padding: 0,
      minWidth: 160,
    },
    generateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    disabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.cardBackgroundColor,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBox: {
      width: '90%',
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
    },
    successIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    modalAmount: {
      fontFamily: theme.fontBold,
      fontSize: 36,
      color: theme.text,
      marginBottom: 20,
    },
    qrImage: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 15,
    },
    actionButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      flex: 1,
      marginRight: 10,
    },
    actionText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.cardBackgroundColor,
      textAlign: 'center',
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.secondary + '20',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      flex: 1,
    },
    shareText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.primary,
      marginLeft: 8,
    },
    closeText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.subtext,
      marginTop: 10,
    },
    sheetOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'flex-end',
      zIndex: 10,
    },

    sheetContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },

    successCircle: {
      backgroundColor: '#E8F5E9',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },

    successText: {
      fontFamily: theme.fontBold,
      fontSize: theme.fontSizeHeading + 4,
      color: '#28a745',
      marginBottom: 10,
    },

    qrCode: {
      width: 180,
      height: 180,
      marginBottom: 16,
    },

    linkText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
      marginBottom: 20,
      maxWidth: '100%',
    },

    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },

    primaryAction: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      flex: 1,
      marginRight: 10,
      alignItems: 'center',
    },

    primaryText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.cardBackgroundColor,
    },

    secondaryAction: {
      backgroundColor: theme.secondary + '20',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },

    secondaryText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.primary,
      marginLeft: 8,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    
    title: {
      fontFamily: theme.fontBold,
      fontSize: 28,
      color: theme.text,
      marginBottom: 40,
      textAlign: 'center',
    },
    
    amountBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: theme.primary,
      paddingBottom: 12,
      marginBottom: 40,
    },
    
    euro: {
      fontSize: 48,
      fontFamily: theme.fontBold,
      color: theme.text,
      marginRight: 8,
    },
    
    amountInput: {
      fontSize: 48,
      fontFamily: theme.fontBold,
      color: theme.text,
      minWidth: 160,
      padding: 0,
    },
    
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    
    ctaText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.cardBackgroundColor,
    },
  });
