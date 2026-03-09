import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function getImageUrl(id: any, name: any) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/${id}-${slug}.jpg`;
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/search/${encodeURIComponent(trimmed)}`,
      );
      if (res.data.response === "success") {
        const heroes = res.data.results.map((hero: any) => ({
          id: hero.id,
          name: hero.name,
          imageUrl: getImageUrl(hero.id, hero.name),
        }));
        setResults(heroes);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Buscar héroe por nombre..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item: any) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/hero/${item.id}` as any)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : searched ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>No se encontraron resultados</Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>
            Escribe el nombre de un héroe para buscar
          </Text>
        </View>
      )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a23",
  },
  searchBar: {
    flexDirection: "row",
    padding: 12,
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  noResults: {
    color: "#666",
    fontSize: 16,
  },
  grid: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 4,
    backgroundColor: "#16213e",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    maxWidth: "33.33%",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    padding: 6,
    textAlign: "center",
  },
});
