import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { FAB, List, Appbar, Text } from 'react-native-paper';
import { NetworkService } from '../NetworkServices';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';

const mockedValues = [
    {
        nome: 'Questionario1'
    },
    {
        nome: 'Questionario2'
    }
];

export default function VistoriasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredValues, setFilteredValues] = useState(mockedValues);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const onPressFab = () => {
        router.push('/Vistorias/add_vistoria')
    }

    const onSearch = (query: any) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredValues(filteredValues);
        } else {
            const filtered = filteredValues.filter(item => item.nome.toLowerCase().includes(query.toLowerCase()));
            setFilteredValues(filtered);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <View
                    style={styles.appbar}
                >
                    <TextInput
                        placeholder='Pesquise aqui...'
                        style={[styles.searchInput, isFocused && {outline: 'none'}]}
                        onBlur={() => setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        value={searchQuery}
                        onChange={(e: any) => onSearch(e.target.value)}
                    />
                    <Appbar.Action icon="magnify" onPress={() => {}} />
                </View>
            </Appbar.Header>

            <View style={styles.content}>
                <Text
                    style={{ fontSize: 16, fontWeight: 'bold' }}>
                    Vistorias
                </Text>
                <List.Section>
                    {
                        filteredValues.map((item) => {
                            return (
                                <List.Item
                                    key={item.nome}
                                    title={item.nome}
                                    style={styles.listItem}
                                />
                            )
                        })
                    }
                </List.Section>
            </View>

            <FAB
                style={styles.fab}
                icon="plus"
                color="white"
                onPress={onPressFab}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        padding: 10,
        backgroundColor: "none",
        elevation: 2,
        outline: 'none',
    },
    appbar:{
        backgroundColor: '#F8F8F8',
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: '50px',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6B8BE7',
    },
});
