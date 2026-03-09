import { ProveedorReemplazoHeroe } from "@/components/ContextoReemplazoHeroe/ContextoReemplazoHeroe";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ProveedorReemplazoHeroe>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="reemplazar-heroe"
          options={{
            headerShown: true,
            headerTitle: "Buscar reemplazo",
            headerStyle: { backgroundColor: "#0a0a23" },
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </ProveedorReemplazoHeroe>
  );
}
