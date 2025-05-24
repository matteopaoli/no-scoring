import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReferredLeadsComponent from '@/components/ReferredLeadsList';

export default function CustomerProfileScreen() {
  const { user } = useAuth();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  user?.image ??
                  'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{`${user?.firstName} ${user?.lastName}`}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Il Tuo Profilo</Text>
          <Text style={styles.sectionText}>
            Benvenuto, {user?.firstName}! Questo è il tuo spazio personale dove puoi vedere e gestire le informazioni legate al tuo account PayTomorrow. Puoi anche invitare negozi e contribuire alla crescita della nostra community.
          </Text>
        </View>
        <ReferredLeadsComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    userName: {
      fontFamily: theme.fontBold,
      fontSize: theme.fontSizeHeading + 8,
      color: theme.text,
    },
    userEmail: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
    },
    referButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#007BFF',
      marginHorizontal: 20,
      marginTop: 40,
      padding: 15,
      borderRadius: 15,
    },
    referButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.cardBackgroundColor,
      marginLeft: 10,
    },
    section: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: 10,
    },
    sectionText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
      lineHeight: 22,
    },
  });
