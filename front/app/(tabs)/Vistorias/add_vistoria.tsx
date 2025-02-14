import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, View, ScrollView, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { Button, Checkbox, Snackbar, Text, Dialog, Portal, TextInput, Divider } from "react-native-paper";
import { NetworkService } from "../NetworkServices";
import * as ImagePicker from 'expo-image-picker';
import { DATABASES } from "../save";
import { ImageManipulator } from "expo-image-manipulator";

interface Aviario {
    id: number;
    name: string;
}

interface Formulario {
    id: number;
    questionnaireName: string;
    questions: Question[];
}

interface Question {
    idQuestion: number;
    question: string;
}

interface QuestionState {
    questionId: number;
    deadline: number;
    answer: boolean;
    photo: string | null;
    observation: string;
}

function base64ToBytes(base64: string, platform: 'android' | 'web'): Uint8Array {
    let binaryString;

    if (platform === 'android') {
        binaryString = atob(base64);
    } else if (platform === 'web') {
        const decoded = Buffer.from(base64, 'base64');
        return new Uint8Array(decoded);
    } else {
        throw new Error('Plataforma não reconhecida');
    }

    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
}

export default function AddVistoria() {
    const [aviario, setAviario] = useState<number | null>(null);
    const [formulario, setFormulario] = useState<number | null>(null);
    const [otherForm, setOtherForm] = useState(false);
    const [aviarios, setAviarios] = useState<Aviario[]>([]);
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [visible, setVisible] = useState(false);


    const [questionsState, setQuestionsState] = useState<QuestionState[]>([]);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);

    const hideDialog = () => setDialogVisible(false);

    async function tirarFoto(questionId: number) {
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
                const newQuestionsState = questionsState.map((question) =>
                    question.questionId === questionId
                        ? { ...question, photo: result.assets[0].uri }
                        : question
                );
                setQuestionsState(newQuestionsState);
            }
        } catch (error) {
            console.error("Erro ao tirar foto:", error);
        }
    }

    const handleCheckboxChange = (questionId: number) => {
        const newQuestionsState = questionsState.map((question) =>
            question.questionId === questionId
                ? { ...question, answer: !question.answer }
                : question
        );
        setQuestionsState(newQuestionsState);
    };

    const handleOpenDialog = (questionId: number) => {
        setCurrentQuestionId(questionId);
        setDialogVisible(true);
    };

    const handleSaveObservacoes = () => {
        if (currentQuestionId !== null) {
            const newQuestionsState = questionsState.map((question) =>
                question.questionId === currentQuestionId
                    ? { ...question, observacao: question.observation }
                    : question
            );
            setQuestionsState(newQuestionsState);
        }
        hideDialog();
    };

    useEffect(() => {
        (async () => {
            try {
                const aviarioResp = await NetworkService.request({
                    database: "null",
                    url: "list-aviaries",
                    method: "GET"
                });
                const aviariosData = await aviarioResp.json();
                setAviarios(aviariosData);

                const formResp = await NetworkService.request({
                    database: "null",
                    url: "questionnaires",
                    method: "GET"
                });
                const formulariosData = await formResp.json();
                setFormularios(formulariosData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        })();
    }, []);

    const onSubmitForm = () => {
        if (!aviario || !formulario) {
            setVisible(true);
        } else {
            const selectedForm = formularios.find((item) => item.id === formulario);
            if (selectedForm) {
                const initialQuestionsState = selectedForm.questions.map((question) => ({
                    questionId: question.idQuestion,
                    deadline: 21,
                    answer: false,
                    photo: null,
                    observation: "",
                }));
                console.log(initialQuestionsState)
                setQuestionsState(initialQuestionsState);
                setOtherForm(true);
            }
        }
    };

    const selectedForm = formularios.find((item) => item.id === formulario);

    //   const handlePhotoChange = (e) => {
    //     const selectedPhoto = e.target.files[0];
    //     setPhotoUrl(URL.createObjectURL(selectedPhoto));

    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //       const arrayBuffer = event.target.result;
    //       const bytes = new Uint8Array(arrayBuffer);
    //       setPhotoBytes(bytes);
    //     };
    //     reader.readAsArrayBuffer(selectedPhoto);

    //   };

    // function base64ToByteArray(base64: string): Uint8Array {
    //     const base64String = base64.split(',')[1];
    //     const binaryString = atob(base64String);
    //     const byteArray = new Uint8Array(binaryString.length);

    //     for (let i = 0; i < binaryString.length; i++) {
    //         byteArray[i] = binaryString.charCodeAt(i);
    //     }

    //     return byteArray;
    // }

    const base64ToBytes = (base64: any) => {
        const binaryString = atob(base64);  // Decodifica Base64 para uma string binária
        const byteArray = new Uint8Array(binaryString.length);  // Cria um array de bytes
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray;
      };

      
      const handleFinalizar = async () => {
    console.log("Questions State:", questionsState);
    
    const reader = new FileReader();
    
    const formatedForm = await Promise.all(questionsState.map( async (item: any) => {
        // Verifica se a propriedade 'photo' existe e não é nula
        if (item.photo) {
            const base64Data = item.photo.split(",")[1];
            const base64 = base64ToBytes(base64Data);
            
            return {
                questionId: item.questionId,
                deadline: 21,
                answer: item.answer ? "Conformidade" : "NaoConformidade",
                photo: Array.from(base64),
                observation: item.observation,
            }
        } else {
            // Caso não haja foto, você pode retornar algo padrão ou tratar de outra forma
            return {
                questionId: item.questionId,
                deadline: 21,
                answer: item.answer ? "Conformidade" : "NaoConformidade",
                photo: null,  // ou algum valor default
                observation: item.observation,
            };
        }
    }))
    
    console.log({
        aviaryId: aviario,
        answers: formatedForm
    })
    
    NetworkService.request({
        database: DATABASES.QUESTIONNAIREANSWERS,
        method: 'POST',
        url: `response-questionnaire`,
        data: {
            aviaryId: aviario,
            answers: formatedForm
        }
    })
    
    alert("Formulário enviado com sucesso!");
};


    return (
        <SafeAreaView style={styles.container}>

            {!otherForm && (
                <>
                    <Stack.Screen options={{ title: 'Adicionar Vistoria' }} />
                    <View style={styles.form}>
                        <View style={styles.inputs}>
                            <Text>Aviário</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={aviario}
                                onValueChange={(itemValue) => setAviario(itemValue)}
                            >
                                <Picker.Item label="Selecione um Aviário" value={null} />
                                {aviarios.map((av) => (
                                    <Picker.Item key={av.id} label={av.name} value={av.id} />
                                ))}
                            </Picker>

                            <Text style={{ marginTop: 20 }}>Formulário</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={formulario}
                                onValueChange={(itemValue) => setFormulario(itemValue)}
                            >
                                <Picker.Item label="Selecione um Formulário" value={null} />
                                {formularios.map((form) => (
                                    <Picker.Item key={form.id} label={form.questionnaireName} value={form.id} />
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.inputs}>
                            <Button style={styles.button} mode="contained" onPress={onSubmitForm}>
                                Avançar
                            </Button>
                        </View>
                    </View>

                    <Snackbar visible={visible} onDismiss={() => setVisible(false)} action={{ label: 'OK' }}>
                        Preencha os dados corretamente
                    </Snackbar>
                </>
            )}

            {otherForm && selectedForm && (
                <>
                    <ScrollView
                        style={{
                            marginTop: 50
                        }}
                    >
                        {selectedForm.questions.map((field) => {
                            const questionState = questionsState.find((q) => q.questionId === field.idQuestion);
                            console.log(questionState)
                            return (
                                <>
                                    <View key={field.idQuestion} style={styles.card_select}>
                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                maxWidth: '20%',
                                                height: '100%'
                                            }}
                                        >
                                            {questionState?.photo ? (
                                                <Button
                                                    onPress={() => tirarFoto(field.idQuestion)}
                                                >
                                                    <Image
                                                        source={{ uri: questionState.photo }}
                                                        style={{ width: 100, height: 100, borderRadius: 8, marginVertical: 8 }}
                                                    />
                                                </Button>
                                            ): (
                                                <Button onPress={() => tirarFoto(field.idQuestion)} icon='camera'> </Button>
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                width: '80%'
                                            }}
                                        >
                                            <View style={{ flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                                <Text style={styles.questionText}>{field.question}</Text>

                                                <Checkbox
                                                    status={questionState?.answer ? 'checked' : 'unchecked'}
                                                    onPress={() => handleCheckboxChange(field.idQuestion)}
                                                    color="#1E3A8A"
                                                />
                                            </View>
                                            <View>
                                                <Button onPress={() => handleOpenDialog(field.idQuestion)}><Text
                                                    style={{
                                                        color: '#1E3A8A'
                                                    }}
                                                >Adicionar Observação</Text></Button>

                                                {questionState?.observation && (
                                                    <Text style={styles.observacaoText}>
                                                        Observação: {questionState.observation}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    <Divider />
                                </>
                            );
                        })}
                    </ScrollView>

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Title>Observações</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    label="Digite sua observação"
                                    value={questionsState.find((q) => q.questionId === currentQuestionId)?.observation || ""}
                                    onChangeText={(text) => {
                                        const newQuestionsState = questionsState.map((question) =>
                                            question.questionId === currentQuestionId
                                                ? { ...question, observation: text }
                                                : question
                                        );
                                        setQuestionsState(newQuestionsState);
                                    }}
                                    multiline
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancelar</Button>
                                <Button onPress={handleSaveObservacoes}>Salvar</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                    <View style={styles.footer}>
                        <Button style={styles.button} mode="contained" onPress={handleFinalizar}>
                            Finalizar
                        </Button>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        marginTop: '20%',
        justifyContent: 'space-around',
        height: '100%',
    },
    inputs: {
        width: '100%',
        alignItems: 'center',
    },
    picker: {
        marginTop: 20,
        width: '90%',
        height: 50,
    },
    button: {
        backgroundColor: '#1E3A8A',
        width: '90%',
    },
    card_select: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,

    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft:15
    },
    observacaoText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
        marginTop: 4,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
    },
});