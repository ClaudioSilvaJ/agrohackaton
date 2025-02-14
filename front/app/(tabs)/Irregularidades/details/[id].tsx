import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FAB, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { NetworkService } from '../../NetworkServices';
import { DATABASES } from '../../save';
import { RelativePathString, useRouter } from 'expo-router';

export default function AviaryDetails() {

  const { aviary } = useLocalSearchParams();
  const [foto, setFoto] = useState('');
  const router = useRouter();

  const questao = typeof aviary === 'string' ? JSON.parse(aviary) : null;

  const base64ToBytes = (base64: any) => {
    const binaryString = atob(base64);  // Decodifica Base64 para uma string binária
    const byteArray = new Uint8Array(binaryString.length);  // Cria um array de bytes
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  };

  const onPressFab = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão da câmera para fazer isso!');
      return;
    }

    try {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                });


    
                if (!result.canceled && result.assets) {
                    const newQuestionsState = result.assets[0].uri;

                    const data = newQuestionsState.split(',')[1];
                    const base64 = base64ToBytes(data);

                    NetworkService.request({
                      database:'null',
                      method: 'POST',
                      url: 'resolver-irregularidade',
                      data: {
                        photo: Array.from(base64),
                        questionAnswers: questao,
                      }
                    })
                }
            } catch (error) {
                console.error("Erro ao tirar foto:", error);
            }
  }

  console.log(questao); 

  const photo = questao?.photo || null;

  function byteArrayToBase64(byteArray: Uint8Array): string {
    return 'data:image/png;base64,' + byteArray;
  }
  
  const base64Image = byteArrayToBase64(photo);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: base64Image }} 
        style={{ width: 200, height: 200 }} 
      />
      {
        questao.observation && (
          <Text>{questao.observation}</Text>
        )
      }
      <FAB
                style={styles.fab}
                icon="plus"
                color="white"
                onPress={onPressFab}
            />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6B8BE7',
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});
