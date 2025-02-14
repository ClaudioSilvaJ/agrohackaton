import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { NetworkService } from '../NetworkServices';
import { DATABASES } from '../save';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000000',
    accent: '#000000',
    background: '#FFFFFF',
    text: '#000000',
    placeholder: '#000000',
  },
};

export default function AddAviario() {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleCreateAviary() {
    try {
      setLoading(true);
      setError(null);

      const test = {
        name: nome,
        address: endereco,
      };

      const response = await NetworkService.request({
          database: DATABASES.AVIARY,
          method: "POST",
          url: "create-aviary",
          data: test
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar aviário: ${response.statusText}`);
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao criar aviário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Adicionar Novo Aviário</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleCreateAviary}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
        >
          Salvar Aviário
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginVertical: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
