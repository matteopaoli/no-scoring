import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, CreditCard, Bell, Lock, HelpCircle, LogOut } from 'lucide-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function MerchantSettingsScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useAppTheme(); // Using the theme hook
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Impostazioni Negozio</Text>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Preferenze</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color={theme.subtext} />
          </View>
          <Text style={[styles.settingText, { color: theme.text }]}>Notifiche</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.secondary, true: theme.primary }}
            thumbColor={notificationsEnabled ? theme.primary : theme.background}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <CreditCard size={20} color={theme.subtext} />
          </View>
          <Text style={[styles.settingText, { color: theme.text }]}>Modalità Scura</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: theme.secondary, true: theme.primary }}
            thumbColor={darkModeEnabled ? theme.primary : theme.background}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Lock size={20} color={theme.subtext} />
          </View>
          <Text style={[styles.settingText, { color: theme.text }]}>Sicurezza</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={theme.subtext} />
          </View>
          <Text style={[styles.settingText, { color: theme.text }]}>Supporto</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.card }]}
        onPress={handleLogout}
      >
        <LogOut size={20} color={theme.primary} />
        <Text style={[styles.logoutText, { color: theme.primary }]}>Esci</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20, // Reduced margin between sections
    borderRadius: 15,
    padding: 15,
    elevation: 3, // Subtle shadow for better depth
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
    borderBottomWidth: 0.5, // Lighter border for separation
    borderBottomColor: '#EEE',
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
});
