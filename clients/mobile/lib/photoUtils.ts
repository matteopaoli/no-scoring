// utils/photoUtils.ts
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Alert } from 'react-native';

export type ImageResult = {
  uri: string;
  name?: string;
  type?: string;
};

export const requestMediaPermissions = async () => {
  const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
  const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
    Alert.alert(
      'Permission required',
      'We need camera and gallery permissions to upload photos',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

export const takePhoto = async (): Promise<ImageResult | null> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: `photo_${Date.now()}.jpg`,
    type: 'image/jpeg',
  };
};

export const pickPhoto = async (): Promise<ImageResult | null> => {
  const hasPermission = await requestMediaPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName || `photo_${Date.now()}.jpg`,
    type: asset.type === 'image' ? 'image/jpeg' : asset.type,
  };
};

export const prepareUpload = (image: ImageResult) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);
  return formData;
};