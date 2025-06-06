import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { Check, Share2, Copy } from 'lucide-react-native';
import { Share } from 'react-native';
import { Theme } from '@/contexts/ThemeContext';

const PaymentSheet = ({ paymentLink, qrCode, amount, onCopy, onClose, theme, router }: { theme: Theme }) => {
  const styles = createSheetStyles(theme);

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.sheet}>
        <Check size={32} color="#28a745" />
        <Text style={styles.sheetTitle}>Ecco il tuo link di pagamento!</Text>
        <Image source={{ uri: qrCode }} style={styles.qr} />

        <View style={styles.linkRow}>
          <Text numberOfLines={1} style={styles.linkText}>{paymentLink}</Text>
          <Pressable onPress={onCopy}><Copy size={20} color={theme.primary} /></Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.openBtn} onPress={() => router.push(paymentLink)}>
            <Text style={styles.openText}>Apri</Text>
          </Pressable>
          <Pressable style={styles.shareBtn} onPress={() => Share.share({ message: `Ciao! Completa il pagamento di €${amount} su PayTomorrow con questo link: ${paymentLink}` })}>
            <Share2 size={16} color={theme.primary} />
            <Text style={{ fontFamily: theme.fontSemiBold, color: theme.buttonTextColor }}>Condividi</Text>
          </Pressable>
        </View>

        <Pressable onPress={onClose}><Text style={styles.close}>Chiudi</Text></Pressable>
      </View>
    </Pressable>
  );
};

const createSheetStyles = (theme: Theme) => StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: theme.cardBackgroundColor,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sheetTitle: { fontSize: 20, fontFamily: theme.fontBold, marginTop: 12, marginBottom: 24, color: theme.text },
  sheetAmount: { fontSize: 30, fontFamily: theme.fontBold, marginVertical: 12 },
  qr: { width: 160, height: 160, marginBottom: 16 },
  linkRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingHorizontal: 12 },
  linkText: { flex: 1, fontFamily: theme.fontRegular, marginRight: 8, color: theme.text },
  actions: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 16 },
  openBtn: { backgroundColor: theme.primary, padding: 12, borderRadius: 12 },
  openText: { fontFamily: theme.fontSemiBold, color: theme.buttonTextColor },
  shareBtn: { flexDirection: 'row', gap: 5, backgroundColor: theme.secondary, padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  close: { fontFamily: theme.fontRegular, color: theme.primary, marginTop: 16 },
});

export default PaymentSheet;
