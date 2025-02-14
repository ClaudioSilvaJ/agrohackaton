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
import { Appbar, FAB, List } from 'react-native-paper';
import { RelativePathString, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Aviary {
  id: string;
  name: string;
  address: string;
}

export default function Aviarios() {
  const [aviaries, setAviaries] = useState<Aviary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const fetchAviaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/list-aviaries`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
        const path = `/(tabs)/Aviario/details/${item.id}`
        router.push(path as RelativePathString)
      }}
    >
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Nome: </Text>
          {item.name}
        </Text>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Endereço: </Text>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const onPressFab = () => {
    router.push('/Aviario/add_aviario');
  };

  const filteredAviaries = aviaries.filter((aviary) =>
    aviary.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <View
          style={styles.appbar}
        >
          <TextInput
            placeholder='Pesquise aqui...'
            style={[styles.searchInput, isFocused && { outline: 'none' }]}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
          <Appbar.Action icon="magnify" onPress={() => { }} /> {/* Ícone de busca */}
        </View>
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={{ fontSize: 26 }} >
          Aviários
        </Text>
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
          <List.Section>
            {
              filteredAviaries ? filteredAviaries.map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const path = `/(tabs)/Aviario/details/${item.id}`
                      router.push(path as RelativePathString)
                    }}
                  >
                    <List.Item
                      key={item.id}
                      title={item.name}
                      style={styles.listItem}
                    />
                  </TouchableOpacity>
                )
              }) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  Nenhum aviário encontrado.
                </Text>
              )
            }
          </List.Section>
        )}
      </View>

      <FAB style={styles.fab} icon="plus" color="white" onPress={onPressFab} />
    </SafeAreaView>
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
  searchInput: {
    padding: 10,
    backgroundColor: "none",
    elevation: 2,
    outline: 'none',
  },
  appbar: {
    backgroundColor: '#F8F8F8',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: '50px',
  },
  content: {
    padding: 16,
  },
  listItem: {
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
});
