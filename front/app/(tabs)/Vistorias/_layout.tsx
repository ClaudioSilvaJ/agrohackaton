import { Stack } from "expo-router";
import { Provider } from "react-native-paper";

export default function Layout(){
    return (
        <Provider>
        <Stack
            screenOptions={{
                headerTransparent: true,
                title: '',
            }}
        />
        </Provider>
    )
}