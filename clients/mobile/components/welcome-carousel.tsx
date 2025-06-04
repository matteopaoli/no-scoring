import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
} from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  description: string;
  isFinal?: boolean;
};

const slides: Slide[] = [
  {
    key: '1',
    title: '🎉 Benvenuto nell’app che ti fa risparmiare (e guadagnare!)',
    description:
      'Scopri come pagare in 3 rate e ricevere 30€ in buoni Amazon segnalando i tuoi negozi preferiti.',
  },
  {
    key: '2',
    title: '🔎 Trova il tuo negozio preferito e paga in 3 comode rate',
    description:
      'Cerca il tuo negozio di fiducia, inserisci il prezzo del prodotto o servizio e paga in tutta sicurezza, direttamente dall’app.\nProprio come fai di solito, ma in tre comode rate.',
  },
  {
    key: '3',
    title: '🏪 Offri il pagamento in 3 rate, incassa tutto subito',
    description:
      'Attiva il servizio in pochi minuti e dai ai tuoi clienti un motivo in più per scegliere te.\nNessun rischio: tu incassi subito l’intero importo, noi pensiamo al resto.\n\nSe sei già registrato su Paytmorrow, clicca su Accedi, inserisci utente e password, e potrai creare i pagamenti direttamente dall’app.',
  },
  {
    key: '4',
    title: '🚀 Sei pronto? Inizia ora!',
    description:
      'Registrati in pochi secondi o accedi con il tuo account.\nChe tu sia un utente o un commerciante, da oggi hai un nuovo modo di pagare e farti scegliere.',
    isFinal: true,
  },
];

export default function WelcomeCarousel({ onClose }: { onClose: () => void }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const translateY = useRef(new Animated.Value(height)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => onClose());
    }
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () =>
    slides.map((_, i) => {
      const opacity = scrollX.interpolate({
        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
    });

const renderBackground = () => (
  <Animated.View
    style={[
      styles.background,
      {
        width: width * slides.length,
        transform: [{ translateX: Animated.multiply(scrollX, -1) }],
      },
    ]}
    pointerEvents="none"
  >
    <Svg width={width * slides.length} height={height} style={StyleSheet.absoluteFill}>
      {/* Page 1 */}
      <Circle cx={width * 0.3} cy={height * 0.2} r={100} fill={theme.primary + '33'} />
      <Circle cx={width * 0.7} cy={height * 0.8} r={60} fill={theme.secondary + '22'} />

      {/* Page 2 */}
      <Circle cx={width * 1.1} cy={height * 0.3} r={140} fill={theme.primary + '22'} />
      <Circle cx={width * 1.6} cy={height * 0.7} r={50} fill={theme.secondary + '33'} />

      {/* Page 3 */}
      <Circle cx={width * 2.2} cy={height * 0.2} r={80} fill={theme.primary + '11'} />
      <Circle cx={width * 2.6} cy={height * 0.6} r={120} fill={theme.secondary + '22'} />
      <Circle cx={width * 2.8} cy={height * 0.85} r={40} fill={theme.primary + '33'} />
    </Svg>
  </Animated.View>
);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {renderBackground()}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        bounces={false}
      />
      <View style={styles.dotsContainer}>{renderDots()}</View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? '✅ Inizia' : '👉 Avanti'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width,
      height,
      bottom: 0,
      backgroundColor: theme.background,
      justifyContent: 'center',
    },
    background: {
      position: 'absolute',
      height,
      top: 0,
      left: 0,
    },
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 28,
    },
    title: {
      fontSize: 24,
      fontFamily: theme.fontBold,
      color: theme.text,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 32,
    },
    description: {
      fontSize: 16,
      fontFamily: theme.fontRegular,
      color: theme.subtext,
      textAlign: 'center',
      lineHeight: 26,
    },
    dotsContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 120,
      alignSelf: 'center',
    },
    dot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
      marginHorizontal: 6,
    },
    button: {
      position: 'absolute',
      bottom: 40,
      alignSelf: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: theme.fontSemiBold,
      color: theme.buttonTextColor,
    },
  });
