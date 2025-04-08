import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, MapPin, Mail, Phone, Globe, CreditCard, Ban as Bank } from 'lucide-react-native';

type BusinessType = 'individual' | 'company';
type AccountType = 'standard' | 'express';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType>('company');
  const [accountType, setAccountType] = useState<AccountType>('standard');
  
  // Business Information
  const [businessInfo, setBusinessInfo] = useState({
    legalName: '',
    businessName: '',
    taxId: '',
    registrationNumber: '',
    website: '',
    phone: '',
    email: '',
    description: '',
  });

  // Address Information
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IT',
  });

  // Bank Account Information
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    accountType: 'checking',
  });

  // Representative Information
  const [representative, setRepresentative] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    idNumber: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'IT',
    },
  });

  const handleSubmit = async () => {
    try {
      // Here we would typically make an API call to your backend
      // which would then create the Stripe Connected Account
      Alert.alert(
        'Success',
        'Your application has been submitted for review. We will notify you once approved.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Type</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            businessType === 'individual' && styles.optionButtonActive,
          ]}
          onPress={() => setBusinessType('individual')}
        >
          <Text style={[
            styles.optionText,
            businessType === 'individual' && styles.optionTextActive,
          ]}>Individual / Sole Proprietor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            businessType === 'company' && styles.optionButtonActive,
          ]}
          onPress={() => setBusinessType('company')}
        >
          <Text style={[
            styles.optionText,
            businessType === 'company' && styles.optionTextActive,
          ]}>Company</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stepTitle}>Account Type</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            accountType === 'standard' && styles.optionButtonActive,
          ]}
          onPress={() => setAccountType('standard')}
        >
          <Text style={[
            styles.optionText,
            accountType === 'standard' && styles.optionTextActive,
          ]}>Standard Account</Text>
          <Text style={styles.optionDescription}>
            Complete control over your branding and user experience
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            accountType === 'express' && styles.optionButtonActive,
          ]}
          onPress={() => setAccountType('express')}
        >
          <Text style={[
            styles.optionText,
            accountType === 'express' && styles.optionTextActive,
          ]}>Express Account</Text>
          <Text style={styles.optionDescription}>
            Quick setup with Stripe-hosted onboarding and dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Information</Text>
      
      <View style={styles.inputGroup}>
        <Building2 size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Legal Business Name"
          value={businessInfo.legalName}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, legalName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Building2 size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Doing Business As (DBA)"
          value={businessInfo.businessName}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, businessName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <CreditCard size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Tax ID / VAT Number"
          value={businessInfo.taxId}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, taxId: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Globe size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Website"
          value={businessInfo.website}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, website: text })}
          keyboardType="url"
        />
      </View>

      <View style={styles.inputGroup}>
        <Phone size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Business Phone"
          value={businessInfo.phone}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Mail size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Business Email"
          value={businessInfo.email}
          onChangeText={(text) => setBusinessInfo({ ...businessInfo, email: text })}
          keyboardType="email-address"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Address</Text>
      
      <View style={styles.inputGroup}>
        <MapPin size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Street Address"
          value={address.line1}
          onChangeText={(text) => setAddress({ ...address, line1: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <MapPin size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Apartment, Suite, etc. (optional)"
          value={address.line2}
          onChangeText={(text) => setAddress({ ...address, line2: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <MapPin size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={address.city}
          onChangeText={(text) => setAddress({ ...address, city: text })}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={address.postalCode}
            onChangeText={(text) => setAddress({ ...address, postalCode: text })}
          />
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Bank Account Information</Text>
      
      <View style={styles.inputGroup}>
        <Bank size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Account Holder Name"
          value={bankAccount.accountHolderName}
          onChangeText={(text) => setBankAccount({ ...bankAccount, accountHolderName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Bank size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="IBAN"
          value={bankAccount.accountNumber}
          onChangeText={(text) => setBankAccount({ ...bankAccount, accountNumber: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Bank size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="SWIFT/BIC Code"
          value={bankAccount.routingNumber}
          onChangeText={(text) => setBankAccount({ ...bankAccount, routingNumber: text })}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}>
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Stripe Account Setup</Text>
      </View>

      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((i) => (
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
      {step === 4 && renderStep4()}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => setStep(step - 1)}>
            <Text style={styles.buttonTextSecondary}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => {
            if (step < 4) {
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}>
          <Text style={styles.buttonTextPrimary}>
            {step === 4 ? 'Submit' : 'Next'}
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
  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  optionButtonActive: {
    borderColor: '#007BFF',
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#666',
  },
  optionTextActive: {
    color: '#007BFF',
  },
  optionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
  row: {
    flexDirection: 'row',
    gap: 10,
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
});