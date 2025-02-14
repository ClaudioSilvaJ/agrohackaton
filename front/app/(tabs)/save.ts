import * as FileSystem from "expo-file-system";
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from "react";

const isWeb = Platform.OS === 'web'

const DATABASES = {
  AVIARY: "aviarys",
  QUESTIONNAIREANSWERS: "questionnaireAnswers"
} as const;

const syncData = async () => {
  const pendingData = await hasPendingData();
  try {
    const state = await NetInfo.fetch(); 

    if (state.isConnected) {
      if(pendingData){
        console.log("Dispositivo está online, sincronizando dados...");
        await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/sync`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(getAllLocalStorageData())
        }).then( async r => {
          await clearAllData()
        }).catch(Error => {
            console.log(Error)
        })
      } else {
        throw new Error("Dont have peding data");
      }
    } else {
      throw new Error("Connection is down");
    }
  } catch (error) {
    
  }
};

const useSyncData = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      syncData();
    }, 10000); 

    return () => clearInterval(interval); 
  }, []);
};


function getAllLocalStorageData(): Record<string, any> {
  const allData: Record<string, any> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        allData[key] = JSON.parse(localStorage.getItem(key) as string);
      } catch (error) {
        console.error(`Erro ao carregar JSON de ${key}:`, error);
        allData[key] = null;
      }
    }
  }

  return allData;
}

const hasPendingData = async (): Promise<boolean> => {
  if (isWeb) {
    return localStorage.length > 0;
  } else {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
      return files.length > 0;
    } catch (error) {
      console.error("Erro ao verificar dados pendentes:", error);
      return false;
    }
  }
};


const saveData = async (data : any, database: string) => {
  const fileUri = FileSystem.documentDirectory + database + ".json";
  try {
    if (isWeb) {
      let dataset = localStorage.getItem(database);
    
      let dataArray = [];
      try {
        dataArray = dataset ? JSON.parse(dataset) : [];
        if (!Array.isArray(dataArray)) dataArray = [];
      } catch (error) {
        console.error("Erro ao carregar JSON:", error);
        dataArray = [];
      }
    
      dataArray.push(data);
    
      localStorage.setItem(database, JSON.stringify(dataArray));
    } else {
      const fileExists = await FileSystem.getInfoAsync(fileUri);
    
      let dataArray = [];
      if (fileExists.exists) {
        try {
          const existingData = await FileSystem.readAsStringAsync(fileUri);
          dataArray = existingData ? JSON.parse(existingData) : [];
          if (!Array.isArray(dataArray)) dataArray = [];
        } catch (error) {
          console.error("Erro ao carregar JSON:", error);
          dataArray = [];
        }
      }

      dataArray.push(data);

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dataArray));
    }
    
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
  }
};

const loadData = async (database: string) => {
  const fileUri = FileSystem.documentDirectory + database + ".json";
  try {
    if (isWeb) {
      const data = localStorage.getItem(database);
      return data ? JSON.parse(data) : [];
    } else {
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (!fileExists.exists) return [];
      const data = await FileSystem.readAsStringAsync(fileUri);
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
    return [];
  }
};

const clearData = async (database: string) => {
  const fileUri = FileSystem.documentDirectory + database + ".json";
  try {
    if (isWeb) {
      localStorage.removeItem(database);
    } else {
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (fileExists.exists) {
        await FileSystem.deleteAsync(fileUri);
      }
    }
    console.log(`Banco de dados "${database}" foi apagado!`);
  } catch (error) {
    console.error("Erro ao limpar os dados:", error);
  }
};

const clearAllData = async () => {
  try {
    if (isWeb) {
      localStorage.clear();
    } else {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
      for (const file of files) {
        await FileSystem.deleteAsync(FileSystem.documentDirectory + file);
      }
    }
    console.log("Todos os bancos de dados foram apagados!");
  } catch (error) {
    console.error("Erro ao limpar todos os dados:", error);
  }
};



export {DATABASES, saveData, loadData, clearData, useSyncData, syncData}
