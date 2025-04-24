import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext'; // Import the context

const DeleteAccountModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const { theme } = useThemeContext(); // Access the theme from the context

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.cardBackgroundColor },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Sei sicuro di voler eliminare il tuo account?
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.cancelButton, { borderColor: theme.border }]}
            >
              <Text style={[styles.cancelText, { color: theme.text }]}>
                Annulla
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.confirmButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.confirmText}>Conferma</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
    color: '#FFFFFF',
  },
});

export default DeleteAccountModal;
