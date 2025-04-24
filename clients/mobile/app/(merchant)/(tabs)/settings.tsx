import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Smartphone,
  Moon,
  Sun,
} from 'lucide-react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import DeleteAccountModal from '@/components/delete-account-modal';
import apiClient from '@/lib/httpClient';

export default function MerchantSettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, themePreference, setThemePreference } = useThemeContext();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(false); // Close the modal
    apiClient
      .post('/user/delete')
      .then(() => {
        handleLogout();
  })
      .catch((error) => {
        console.error('Error deleting account:', error);
        // Handle the error, e.g., show an alert
      });
  };

  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false); // Just close the modal
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://app.paytomorrow.it/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://app.paytomorrow.it/terms');
  };
  
  const isActive = (mode: 'light' | 'dark' | null) => themePreference === mode;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Impostazioni Negozio
      </Text>

      {/* Preferences Section */}
      <SettingsSection title="Preferenze" theme={theme}>
        <SettingsItem
          icon={<Bell size={20} color={theme.subtext} />}
          label="Notifiche"
          theme={theme}
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.secondary, true: theme.primary }}
              thumbColor={
                notificationsEnabled ? theme.primary : theme.background
              }
            />
          }
        />

        <View
          style={[
            styles.settingItem,
            {
              borderBottomWidth: 0,
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View style={styles.settingIcon}>
              <CreditCard size={20} color={theme.subtext} />
            </View>
            <Text style={[styles.settingText, { color: theme.text }]}>
              Tema
            </Text>
          </View>

          <View style={styles.themeButtonsContainer}>
            <ThemeOption
              icon={
                <Smartphone
                  size={18}
                  color={isActive(null) ? theme.background : theme.text}
                />
              }
              label="Sistema"
              active={isActive(null)}
              onPress={() => setThemePreference(null)}
              theme={theme}
            />
            <ThemeOption
              icon={
                <Sun
                  size={18}
                  color={isActive('light') ? theme.background : theme.text}
                />
              }
              label="Chiaro"
              active={isActive('light')}
              onPress={() => setThemePreference('light')}
              theme={theme}
            />
            <ThemeOption
              icon={
                <Moon
                  size={18}
                  color={isActive('dark') ? theme.background : theme.text}
                />
              }
              label="Scuro"
              active={isActive('dark')}
              onPress={() => setThemePreference('dark')}
              theme={theme}
            />
          </View>
        </View>

        {/* Account Section */}
        {/* <SettingsSection title="Account" theme={theme}>
          <SettingsItem
            icon={<Lock size={20} color={theme.subtext} />}
            label="Sicurezza"
            theme={theme}
          />
          <SettingsItem
            icon={<HelpCircle size={20} color={theme.subtext} />}
            label="Supporto"
            theme={theme}
          /> */}
      </SettingsSection>
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <LogOut size={24} color="#FFFFFF" />
        <Text style={styles.signOutButtonText}>Esci</Text>
      </TouchableOpacity>
      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={openPrivacyPolicy}>
          <Text style={[styles.footerLinkText, { color: theme.subtext }]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerLinkSeparator, { color: theme.subtext }]}>
          •
        </Text>

        <TouchableOpacity onPress={openTermsOfService}>
          <Text style={[styles.footerLinkText, { color: theme.subtext }]}>
            Termini di servizio
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerLinkSeparator, { color: theme.subtext }]}>
          •
        </Text>

        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <Text style={[styles.footerLinkText, { color: theme.subtext }]}>
            Elimina Account
          </Text>
        </TouchableOpacity>
      </View>
      <DeleteAccountModal
        visible={isDeleteModalVisible}
        onCancel={cancelDeleteAccount}
        onConfirm={confirmDeleteAccount}
      />
    </View>
  );
}

function SettingsSection({ title, children, theme }) {
  return (
    <View
      style={[styles.section, { backgroundColor: theme.cardBackgroundColor }]}
    >
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function SettingsItem({
  icon,
  label,
  theme,
  rightElement = null,
  noBorder = false,
}) {
  return (
    <View
      style={[
        styles.settingItem,
        {
          borderBottomWidth: noBorder ? 0 : 0.5,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      {rightElement}
    </View>
  );
}

function ThemeOption({ icon, label, active, onPress, theme }) {
  return (
    <TouchableOpacity
      style={[
        styles.themeButton,
        {
          backgroundColor: active ? theme.primary : theme.background,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text
        style={[
          styles.themeButtonText,
          {
            color: active ? theme.background : theme.text,
            fontFamily: theme.fontSemiBold,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    marginLeft: 10,
  },
  themeButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    width: '100%',
    justifyContent: 'center',
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 5,
  },
  themeButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerLinkText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  footerLinkSeparator: {
    marginHorizontal: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4D4D',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});
