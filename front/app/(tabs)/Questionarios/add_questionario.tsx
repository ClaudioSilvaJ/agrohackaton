import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  IconButton, 
  Divider, 
  List, 
  Provider as PaperProvider, 
  DefaultTheme 
} from 'react-native-paper';
import { useRouter } from 'expo-router';

interface Question {
  idQuestion: string;
  question: string;
  priority: number;
}

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

export default function AddQuestionario() {
  const [questionnaireName, setQuestionnaireName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { idQuestion: '', question: '', priority: 1 }
  ]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addQuestion = () => {
    const newPriority = questions.length + 1;
    setQuestions([
      ...questions,
      { idQuestion: '', question: '', priority: newPriority }
    ]);
    setExpandedIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    updatedQuestions.forEach((q, i) => (q.priority = i + 1));
    setQuestions(updatedQuestions);
    if(expandedIndex === index) {
      setExpandedIndex(null);
    } else if(expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'priority' ? parseInt(value, 10) : value,
    };
    setQuestions(updatedQuestions);
  };

  async function handleCreateQuestionnaire() {
    try {
      setLoading(true);
      setError(null);

      const requestBody = {
        questionnaireName,
        questions,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/create-questionnaire`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao criar questionário: ${response.statusText}`);
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao criar questionário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Adicionar Novo Questionário</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          label="Nome do Questionário"
          value={questionnaireName}
          onChangeText={setQuestionnaireName}
          mode="outlined"
          style={styles.input}
        />

        {questions.map((q, index) => (
          <List.Accordion
            key={index}
            title={`Pergunta ${index + 1}`}
            expanded={expandedIndex === index}
            onPress={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <TextInput
              label="ID da Pergunta"
              value={q.idQuestion}
              onChangeText={(value) => updateQuestion(index, 'idQuestion', value)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Texto da Pergunta"
              value={q.question}
              onChangeText={(value) => updateQuestion(index, 'question', value)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Prioridade"
              value={q.priority.toString()}
              onChangeText={(value) => updateQuestion(index, 'priority', value)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            {questions.length > 1 && (
              <IconButton
                icon="delete"
                iconColor="red"
                size={24}
                onPress={() => removeQuestion(index)}
              />
            )}

            <Divider style={styles.divider} />
          </List.Accordion>
        ))}

        <Button
          icon="plus"
          mode="outlined"
          onPress={addQuestion}
          style={styles.addQuestionButton}
        >
          Adicionar Pergunta
        </Button>

        <Button
          mode="contained"
          onPress={handleCreateQuestionnaire}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
        >
          Salvar Questionário
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
  accordion: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  accordionTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addQuestionButton: {
    marginVertical: 16,
  },
  saveButton: {
    marginVertical: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
