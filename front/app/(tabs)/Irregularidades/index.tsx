import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { RelativePathString, useRouter } from 'expo-router';
import { NetworkService } from '../NetworkServices';

interface Aviary {
  item: any;
  id: string;
  question: any;
}

export default function Aviarios() {
  const [aviaries, setAviaries] = useState<Aviary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // useEffect(() => {
  //   router.replace('/Aviario');
  // }, []);

  const fetchAviaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await NetworkService.request({
        database: null,
        method: 'GET',
        url: 'irregularidades',
      })
      if (!response.ok) {
        throw new Error(`Erro ao buscar aviários: ${response.statusText}`);
      }
      const data: Aviary[] = await response.json();
      setAviaries(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido ao buscar aviários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAviaries();
  }, []);

  const renderItem = ({ item }: { item: Aviary }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(tabs)/Irregularidades/details/[id]",
          params: {
            id: item.id,
            aviary: JSON.stringify(item),
          },
        });
      }}
    >
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Questão: </Text>
          {item.question.question}
        </Text>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Prioridade: </Text>
          {item.question.priority}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredAviaries = aviaries.filter((aviary) =>
    aviary.question.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquise aqui..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={[styles.header, { fontSize: 20 }]}>Irregularidades</Text>
      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
          {error}
        </Text>
      )}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6200EE"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredAviaries}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nenhum aviário encontrado.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 8,
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6B8BE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
