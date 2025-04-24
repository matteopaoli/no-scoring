import { ImageResult } from "@/lib/photoUtils";

export type UserInfo = {
    firstName: string;
    lastName: string;
    storeName: string;
    storeDescription: string;
    storeLocation: { lat: number; lng: number; address: string } | null;
    storePlaceId: string;
    customerPaysFees: boolean;
    profileImage: ImageResult | null;
    storeImage: ImageResult | null;
    password: string;
    confirmPassword: string;
    acceptedTOS: boolean;
  };
  
  export type ValidationResult = {
    isValid: boolean;
    errors: Record<string, string>;
  };
  
  export type OnboardingStepProps = {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    shouldValidate: boolean;
  };