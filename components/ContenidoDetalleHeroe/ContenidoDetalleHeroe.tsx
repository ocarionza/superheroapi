import BarraEstadistica from "@/components/BarraEstadistica/BarraEstadistica";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const ETIQUETAS_STATS = [
  { key: "intelligence", label: "INT" },
  { key: "strength", label: "FUE" },
  { key: "speed", label: "VEL" },
  { key: "durability", label: "DUR" },
  { key: "power", label: "POD" },
  { key: "combat", label: "COM" },
];

export default function ContenidoDetalleHeroe({ hero }: any) {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hero.imageUrl }} style={styles.heroImage} />
      <Text style={styles.heroName}>{hero.name}</Text>
      <Text style={styles.heroFullName}>
        {hero.biography["full-name"] || "Nombre desconocido"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {ETIQUETAS_STATS.map(({ key, label }) => (
          <BarraEstadistica
            key={key}
            label={label}
            value={parseInt(hero.powerstats[key]) || 0}
            result={null}
          />
        ))}
      </View>

      <View style={styles.section}>
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
          Editorial: {hero.biography.publisher || "-"}
        </Text>
        <Text style={styles.detailText}>
          Alineación: {hero.biography.alignment || "-"}
        </Text>
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <Text style={styles.detailText}>
          Género: {hero.appearance.gender || "-"}
        </Text>
        <Text style={styles.detailText}>
          Raza: {hero.appearance.race || "-"}
        </Text>
        <Text style={styles.detailText}>
          Altura: {hero.appearance.height?.join(" / ") || "-"}
        </Text>
        <Text style={styles.detailText}>
          Peso: {hero.appearance.weight?.join(" / ") || "-"}
        </Text>
        <Text style={styles.detailText}>
          Color de ojos: {hero.appearance["eye-color"] || "-"}
        </Text>
        <Text style={styles.detailText}>
          Color de cabello: {hero.appearance["hair-color"] || "-"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a23",
  },
  heroImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  heroName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  heroFullName: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  detailText: {
    color: "#ccc",
    fontSize: 14,
    marginVertical: 2,
  },
});
