import { useReemplazoHeroe } from "@/components/ContextoReemplazoHeroe/ContextoReemplazoHeroe";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL =
  "https://superheroapi.com/api/bfb46904e3db0ea1b1f2ce2093a9842f";

function obtenerUrlImagen(id: any, name: any) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/${id}-${slug}.jpg`;
}

export default function PantallaReemplazarHeroe() {
  const router = useRouter();
  const { player } = useLocalSearchParams<{ player: string }>();
  const { setReemplazo } = useReemplazoHeroe();

  const [consultaBusqueda, setConsultaBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);

  const manejarBusqueda = async () => {
    const limpio = consultaBusqueda.trim();
    if (!limpio) return;
    setBuscando(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/search/${encodeURIComponent(limpio)}`,
      );
      if (res.data.response === "success") {
        const heroesConStats = await Promise.all(
          res.data.results.map(async (hero: any) => {
            const statsRes = await axios.get(
              `${BASE_URL}/${hero.id}/powerstats`,
            );
            const stats = statsRes.data;
            return {
              id: hero.id,
              name: hero.name,
              powerstats: {
                intelligence: stats.intelligence,
                strength: stats.strength,
                speed: stats.speed,
                durability: stats.durability,
                power: stats.power,
                combat: stats.combat,
              },
              imageUrl: obtenerUrlImagen(hero.id, hero.name),
            };
          }),
        );
        setResultadosBusqueda(heroesConStats);
      } else {
        setResultadosBusqueda([]);
      }
    } catch {
      setResultadosBusqueda([]);
    }

    setBuscando(false);
  };

  const seleccionarHeroe = (hero: any) => {
    setReemplazo({ hero, player: Number(player) });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del héroe..."
          placeholderTextColor="#666"
          value={consultaBusqueda}
          onChangeText={setConsultaBusqueda}
          onSubmitEditing={manejarBusqueda}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity style={styles.searchButton} onPress={manejarBusqueda}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {buscando ? (
        <ActivityIndicator
          size="large"
          color="#E53935"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={resultadosBusqueda}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => seleccionarHeroe(item)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.resultImage}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultStats}>
                  INT:{item.powerstats.intelligence} FUE:
                  {item.powerstats.strength} VEL:{item.powerstats.speed}
                </Text>
                <Text style={styles.resultStats}>
                  DUR:{item.powerstats.durability} POD:
                  {item.powerstats.power} COM:{item.powerstats.combat}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {consultaBusqueda.trim()
                ? "Sin resultados"
                : "Busca un héroe para reemplazar tu carta"}
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
    backgroundColor: "#0a0a23",
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#16213e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  searchButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  resultName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultStats: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 2,
  },
  empty: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
});
