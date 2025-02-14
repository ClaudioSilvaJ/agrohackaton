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

interface Questionnaire {
  id: string;
  questionnaireName: string;
  questions: any[];
}

export default function Questionarios() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/questionnaires`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar questionários: ${response.statusText}`);
      }
      const data: Questionnaire[] = await response.json();
      setQuestionnaires(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido ao buscar questionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const renderItem = ({ item }: { item: Questionnaire }) => (
    <TouchableOpacity
        onPress={() => {
            const path = `/(tabs)/Questionarios/details/${item.id}`
            router.push(path as RelativePathString)
            console.log(item)  // ver info do item
        }}
    >
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Questionário: </Text>
          {item.questionnaireName}
        </Text>
        <Text style={styles.listItemTitle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Num. de Perguntas: </Text>
          {item.questions.length}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const onPressFab = () => {
    router.push('/Questionarios/add_questionario');
  };

  const filteredQuestionnaires = questionnaires.filter((q) =>
    q.questionnaireName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquise aqui..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={[styles.header, { fontSize: 20 }]}>Questionários</Text>
      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
          {error}
        </Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredQuestionnaires}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nenhum questionário encontrado.
            </Text>
          }
        />
      )}
      <FAB style={styles.fab} icon="plus" color="white" onPress={onPressFab} />
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
