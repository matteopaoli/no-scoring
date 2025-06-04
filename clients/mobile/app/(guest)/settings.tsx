import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Bell,
  LogOut,
  Smartphone,
  Moon,
  Sun,
  SunDimIcon,
} from 'lucide-react-native';
import { Theme, useAppTheme, useThemeContext } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';
import { Toast } from 'toastify-react-native';
import DeleteAccountModal from '@/components/delete-account-modal';
import { FontAwesome } from '@expo/vector-icons';

export default function MerchantSettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const { theme, themePreference, setThemePreference } = useThemeContext();
  const { user } = useAuth();
  const styles = makeStyles(theme)

  const isActive = (mode: 'light' | 'dark' | null) => themePreference === mode;

  const handleLogout = async () => {
    await logout();
    router.replace('/(guest)/(home)');
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(false); // Close the modal
    apiClient
      .post('/users/delete')
      .then(() => {
        handleLogout();
        Toast.success(
          'Il tuo account è stato eliminato con successo. Ci dispiace vederti andare via.',
          'bottom',
        );
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

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Scarica l’app PayTomorrow!\n\n📱 Android: https://play.google.com/store/apps/details?id=com.matteopaoli.paytomorrowapp&pli=1\n🍏 iOS: https://apps.apple.com/it/app/paytomorrow/id6745253657',
      });
    } catch (error) {
      console.error('Errore condivisione:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Impostazioni</Text>
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
              <SunDimIcon size={20} color={theme.subtext} />
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
      {!!user ? (
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <LogOut size={24} color="#FFFFFF" />
          <Text style={styles.signOutButtonText}>Esci</Text>
        </TouchableOpacity>
      ) : null}
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

        {!!user ? (
          <>
            <Text
              style={[styles.footerLinkSeparator, { color: theme.subtext }]}
            >
              •
            </Text>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <Text style={[styles.footerLinkText, { color: theme.subtext }]}>
                Elimina Account
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      <View>
        <Text style={styles.socialText}>Ti piace PayTomorrow? Seguici sui nostri profili social</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.facebook.com/people/Pay-Tomorrow/61565769418431/',
              )
            }
          >
            <FontAwesome
              name="facebook-square"
              size={48}
              color="#3b5998"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/pay.tomorrow/')
            }
          >
            <FontAwesome name="instagram" size={48} color="#C13584" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
        <Text style={styles.shareButtonText}>Condividi l'app</Text>
      </TouchableOpacity>
      {!!user ? (
        <DeleteAccountModal
          visible={isDeleteModalVisible}
          onCancel={cancelDeleteAccount}
          onConfirm={confirmDeleteAccount}
        />
      ) : null}
    </View>
  );
}

function SettingsSection({ title, children, theme }) {
  const styles = makeStyles(theme)
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
  const styles = makeStyles(theme)
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
  const styles = makeStyles(theme)
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

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: theme.fontBold,
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
    fontFamily: theme.fontSemiBold,
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
    fontFamily: theme.fontRegular,
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
    fontFamily: theme.fontSemiBold,
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
    fontFamily: theme.fontSemiBold,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerLinkText: {
    fontFamily: theme.fontRegular,
    fontSize: 14,
  },
  footerLinkSeparator: {
    marginHorizontal: 10,
  },
  shareButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  shareButtonText: {
    fontFamily: theme.fontSemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  socialText: {
    color: theme.subtext,
    textAlign: 'center'
  }
});
