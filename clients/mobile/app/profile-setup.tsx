import 'react-native-get-random-values';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Store, Lock } from 'lucide-react-native';
import { ImageResult, pickPhoto, takePhoto } from '@/lib/photoUtils';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import apiClient from '@/lib/httpClient';
import { ImageManipulator } from 'expo-image-manipulator';
import { useAuth } from '../contexts/AuthContext';

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shouldValidate, setShouldValidate] = useState(false);
  const { refreshUser } = useAuth();

  // User Information
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    storeDescription: '',
    storeLocation: null as { lat: number; lng: number; address: string } | null,
    storePlaceId: '',
    customerPaysFees: false,
    profileImage: null as ImageResult | null,
    storeImage: null as ImageResult | null,
    password: '',
    confirmPassword: '',
  });

  const validateStep = (step: number, userInfo: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!userInfo.firstName.trim()) {
        errors.firstName = 'Il nome è obbligatorio';
      }
      if (!userInfo.lastName.trim()) {
        errors.lastName = 'Il cognome è obbligatorio';
      }
    }

    if (step === 3 && !userInfo.storeName.trim()) {
      errors.storeName = 'Il nome del negozio è obbligatorio';
    }

    if (step === 6) {
      if (!userInfo.password) {
        errors.password = 'La password è obbligatoria';
      } else {
        if (userInfo.password.length < 8) {
          errors.password = 'La password deve essere lunga almeno 8 caratteri';
        }
        if (!/[a-z]/.test(userInfo.password)) {
          errors.password =
            errors.password ||
            'La password deve contenere almeno una lettera minuscola';
        }
        if (!/[A-Z]/.test(userInfo.password)) {
          errors.password =
            errors.password ||
            'La password deve contenere almeno una lettera maiuscola';
        }
        if (!/[0-9]/.test(userInfo.password)) {
          errors.password =
            errors.password || 'La password deve contenere almeno un numero';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(userInfo.password)) {
          errors.password =
            errors.password ||
            'La password deve contenere almeno un simbolo speciale';
        }
        if (userInfo.password !== userInfo.confirmPassword) {
          errors.confirmPassword = 'Le password non corrispondono';
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleTakeProfilePhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      setUserInfo({ ...userInfo, profileImage: photo });
    }
  };

  const handlePickProfilePhoto = async () => {
    const photo = await pickPhoto();
    if (photo) {
      setUserInfo({ ...userInfo, profileImage: photo });
    }
  };

  const handleTakeStorePhoto = async () => {
    const photo = await takePhoto();
    if (photo) {
      setUserInfo({ ...userInfo, storeImage: photo });
    }
  };

  const handlePickStorePhoto = async () => {
    const photo = await pickPhoto();
    if (photo) {
      setUserInfo({ ...userInfo, storeImage: photo });
    }
  };

  const handleSubmit = async () => {
    const convertImageToBase64 = async (uri: string): Promise<string> => {
      try {
        const resizedImage = await ImageManipulator.manipulate(uri)
          .resize({
            width: 512,
          })
          .renderAsync()
          .then((v) => v.saveAsync());

        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              const base64Prefix = '  ';
              resolve(base64Prefix + reader.result.split(',')[1]);
            } else {
              reject(new Error('Failed to convert image to Base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        throw new Error('Error resizing image: ' + error);
      }
    };

    try {
      // Convert images to base64
      const profileImageBase64 = userInfo.profileImage
        ? await convertImageToBase64(userInfo.profileImage.uri)
        : undefined;

      const storeImageBase64 = userInfo.storeImage
        ? await convertImageToBase64(userInfo.storeImage.uri)
        : undefined;

      // Prepare the payload according to your DTO
      const payload = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        storeName: userInfo.storeName,
        storeDescription: userInfo.storeDescription,
        storePlaceId: userInfo.storePlaceId,
        storeLocationLat: userInfo.storeLocation?.lat.toString() || '',
        storeLocationLng: userInfo.storeLocation?.lng.toString() || '',
        customerPaysFees: userInfo.customerPaysFees,
        password: userInfo.password,
        profileImage: profileImageBase64,
        storeImage: storeImageBase64,
      };
      await apiClient.post('/users/setup-profile', payload);
      await refreshUser();
      setStep(8);
    } catch (error) {
      Alert.alert(
        'Errore',
        error.response?.data?.message ||
          'Qualcosa è andato storto. Per favore riprova.',
      );
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setShouldValidate(false);
    } else {
      router.push('/');
    }
  };

  const handleNextStep = async () => {
    setShouldValidate(true);
    const validation = validateStep(step, userInfo);

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Errore', firstError);
      return;
    }

    if (step === 7) {
      await handleSubmit();
    } else if (step < 8) {
      setStep(step + 1);
      setShouldValidate(false);
    } else if (step === 8) {
      router.back();
    }
  };

  const renderStep1 = () => {
    const validation = validateStep(1, userInfo);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Nome e Cognome</Text>

        <View style={styles.inputGroup}>
          <User size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#999"
            value={userInfo.firstName}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, firstName: text })
            }
          />
        </View>
        {shouldValidate && validation.errors.firstName && (
          <Text style={styles.errorText}>{validation.errors.firstName}</Text>
        )}

        <View style={styles.inputGroup}>
          <User size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Cognome"
            placeholderTextColor="#999"
            value={userInfo.lastName}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, lastName: text })
            }
          />
        </View>
        {shouldValidate && validation.errors.lastName && (
          <Text style={styles.errorText}>{validation.errors.lastName}</Text>
        )}
      </View>
    );
  };

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Immagine del Profilo</Text>
      {userInfo.profileImage ? (
        <Image
          source={{ uri: userInfo.profileImage.uri }}
          style={styles.previewImage}
        />
      ) : null}
      <View style={styles.photoButtonsContainer}>
        <TouchableOpacity
          style={[styles.photoButton, styles.primaryButton]}
          onPress={handleTakeProfilePhoto}
        >
          <Text style={styles.buttonText}>Scatta Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.photoButton, styles.secondaryButton]}
          onPress={handlePickProfilePhoto}
        >
          <Text style={styles.buttonText}>Scegli dalla Galleria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => {
    const validation = validateStep(3, userInfo);
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Dettagli Negozio</Text>
        <View style={styles.inputGroup}>
          <Store size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nome Negozio"
            placeholderTextColor="#999"
            value={userInfo.storeName}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, storeName: text })
            }
          />
        </View>
        {shouldValidate && validation.errors.storeName && (
          <Text style={styles.errorText}>{validation.errors.storeName}</Text>
        )}

        <View style={[styles.inputGroup, { alignItems: 'flex-start' }]}>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Descrizione del negozio"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={userInfo.storeDescription}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, storeDescription: text })
            }
          />
        </View>
        <Text style={styles.hintText}>
          Descrivi cosa rende speciale il tuo negozio
        </Text>
      </View>
    );
  };

  const renderFeeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Commissioni di Servizio</Text>
      <Text style={styles.stepDescription}>
        Le commissioni di servizio (2%) coprono i costi di pagamento e
        manutenzione della piattaforma.
      </Text>

      <View style={styles.feeOption}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUserInfo({ ...userInfo, customerPaysFees: true })}
        >
          <View
            style={[
              styles.radioOuter,
              userInfo.customerPaysFees && styles.radioOuterSelected,
            ]}
          >
            {userInfo.customerPaysFees && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.feeOptionText}>
            Addebita le commissioni al cliente
            {'\n'}
            <Text style={styles.feeOptionSubtext}>
              (Il prezzo visualizzato includerà +2%)
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feeOption}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setUserInfo({ ...userInfo, customerPaysFees: false })}
        >
          <View
            style={[
              styles.radioOuter,
              !userInfo.customerPaysFees && styles.radioOuterSelected,
            ]}
          >
            {!userInfo.customerPaysFees && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.feeOptionText}>
            Assorbi le commissioni nel tuo prezzo
            {'\n'}
            <Text style={styles.feeOptionSubtext}>
              (Riceverai il 98% dell'importo pagato)
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStoreLocationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Posizione del Negozio</Text>
      <Text style={styles.stepSubtitle}>
        Seleziona la posizione esatta del tuo negozio
      </Text>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder="Cerca..."
          minLength={2}
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              setUserInfo((prev) => ({
                ...prev,
                storeLocation: {
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                  address: data.description,
                },
                storePlaceId: data.place_id,
              }));
            }
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            language: 'it',
            components: 'country:it',
          }}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Immagine Negozio</Text>
      {userInfo.storeImage ? (
        <Image
          source={{ uri: userInfo.storeImage.uri }}
          style={styles.previewImage}
        />
      ) : null}
      <View style={styles.photoButtonsContainer}>
        <TouchableOpacity
          style={[styles.photoButton, styles.primaryButton]}
          onPress={handleTakeStorePhoto}
        >
          <Text style={styles.buttonText}>Scatta Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.photoButton, styles.secondaryButton]}
          onPress={handlePickStorePhoto}
        >
          <Text style={styles.buttonText}>Scegli dalla Galleria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => {
    const validation = validateStep(5, userInfo);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Imposta Password</Text>

        <View style={styles.inputGroup}>
          <Lock size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={userInfo.password}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, password: text })
            }
            secureTextEntry
          />
        </View>
        {validation.errors.password && (
          <Text style={styles.errorText}>{validation.errors.password}</Text>
        )}

        <View style={styles.inputGroup}>
          <Lock size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Conferma Password"
            placeholderTextColor="#999"
            value={userInfo.confirmPassword}
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, confirmPassword: text })
            }
            secureTextEntry
          />
        </View>
        {validation.errors.confirmPassword && (
          <Text style={styles.errorText}>
            {validation.errors.confirmPassword}
          </Text>
        )}

        {!validation.errors.password && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementTitle}>
              Requisiti della password:
            </Text>
            <Text
              style={[
                styles.requirement,
                userInfo.password.length >= 8 && styles.requirementMet,
              ]}
            >
              • Almeno 8 caratteri
            </Text>
            <Text
              style={[
                styles.requirement,
                /[a-z]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno una lettera minuscola
            </Text>
            <Text
              style={[
                styles.requirement,
                /[A-Z]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno una lettera maiuscola
            </Text>
            <Text
              style={[
                styles.requirement,
                /[0-9]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno un numero
            </Text>
            <Text
              style={[
                styles.requirement,
                /[!@#$%^&*(),.?":{}|<>]/.test(userInfo.password) &&
                  styles.requirementMet,
              ]}
            >
              • Almeno un simbolo speciale
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profilo Configurato</Text>
      <Text style={styles.stepDescription}>
        Il tuo profilo è stato configurato con successo! Ora puoi iniziare a
        usare l'app.
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Configurazione Profilo</Text>
      </View>
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === step && styles.progressDotActive,
              i < step && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStoreLocationStep()}
      {step === 5 && renderStep4()}
      {step === 6 && renderStep5()}
      {step === 7 && renderFeeStep()}
      {step === 8 && renderStep6()}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.buttonTextSecondary}>Precedente</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNextStep}
        >
          <Text style={styles.buttonTextPrimary}>
            {step === 8 ? 'Chiudi' : 'Avanti'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B7EDC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF50',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: '#28A745',
  },
  stepContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  stepDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#007BFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007BFF',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
  },
  buttonTextPrimary: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#007BFF',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 15,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  photoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
  passwordRequirements: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  requirementTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  requirement: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#dc3545',
  },
  requirementMet: {
    color: '#28a745',
    textDecorationLine: 'line-through',
  },
  stepSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  mapButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  coordinatesContainer: {
    marginTop: 10,
  },
  coordinatesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  hintText: {
    fontFamily: 'Poppins-Italic',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  feeOption: {
    marginTop: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#007BFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  feeOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  feeOptionSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  mapView: { height: 300, width: '100%', borderRadius: 10 },
  locationText: { textAlign: 'center', marginTop: 10 },
  autocompleteContainer: {
    zIndex: 1, // Ensure it appears above other elements
    width: '100%',
  },
});
