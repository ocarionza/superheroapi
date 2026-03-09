import axios from "axios";
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

function getImageUrl(id: any, name: any) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/${id}-${slug}.jpg`;
}

const STAT_LABELS = [
  { key: "intelligence", label: "Inteligencia" },
  { key: "strength", label: "Fuerza" },
  { key: "speed", label: "Velocidad" },
  { key: "durability", label: "Durabilidad" },
  { key: "power", label: "Poder" },
  { key: "combat", label: "Combate" },
];

function HeroResultCard({ hero }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.resultHeader}>
        <Image source={{ uri: hero.imageUrl }} style={styles.resultImage} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>{hero.name}</Text>
          <Text style={styles.resultFullName}>
            {hero.biography["full-name"] || "Desconocido"}
          </Text>
          <Text style={styles.resultPublisher}>
            {hero.biography.publisher || "Sin editorial"}
          </Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedInfo}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          {STAT_LABELS.map(({ key, label }) => (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statLabel}>{label}</Text>
              <View style={styles.statBarBg}>
                <View
                  style={[
                    styles.statBarFill,
                    {
                      width: `${Math.max(parseInt(hero.powerstats[key]) || 0, 5)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.statValue}>{hero.powerstats[key]}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Biografía</Text>
          <Text style={styles.detailText}>
            Nombre completo: {hero.biography["full-name"] || "-"}
          </Text>
          <Text style={styles.detailText}>
            Lugar de nacimiento: {hero.biography["place-of-birth"] || "-"}
          </Text>
          <Text style={styles.detailText}>
            Primera aparición: {hero.biography["first-appearance"] || "-"}
          </Text>
          <Text style={styles.detailText}>
            Alineación: {hero.biography.alignment || "-"}
          </Text>

          <Text style={styles.sectionTitle}>Apariencia</Text>
          <Text style={styles.detailText}>
            Género: {hero.appearance.gender} | Raza: {hero.appearance.race}
          </Text>
          <Text style={styles.detailText}>
            Altura: {hero.appearance.height?.join(" / ") || "-"}
          </Text>
          <Text style={styles.detailText}>
            Peso: {hero.appearance.weight?.join(" / ") || "-"}
          </Text>
          <Text style={styles.detailText}>
            Ojos: {hero.appearance["eye-color"]} | Cabello:{" "}
            {hero.appearance["hair-color"]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
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
          ...hero,
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
          renderItem={({ item }: any) => <HeroResultCard hero={item} />}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: 12,
    gap: 10,
  },
  resultCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  resultInfo: {
    marginLeft: 12,
    flex: 1,
  },
  resultName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultFullName: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  resultPublisher: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 2,
  },
  expandedInfo: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#0f3460",
    paddingTop: 10,
  },
  sectionTitle: {
    color: "#E53935",
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 1,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  statLabel: {
    color: "#ccc",
    fontSize: 12,
    width: 90,
  },
  statBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: "#0a0a23",
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  statBarFill: {
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  statValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    width: 30,
    textAlign: "right",
  },
  detailText: {
    color: "#ccc",
    fontSize: 12,
    marginVertical: 1,
  },
});
