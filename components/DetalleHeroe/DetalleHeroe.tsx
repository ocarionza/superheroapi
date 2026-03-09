import BarraEstadistica from "@/components/BarraEstadistica/BarraEstadistica";
import { Image, StyleSheet, Text, View } from "react-native";

const ETIQUETAS_STATS = [
  { key: "intelligence", label: "INT" },
  { key: "strength", label: "FUE" },
  { key: "speed", label: "VEL" },
  { key: "durability", label: "DUR" },
  { key: "power", label: "POD" },
  { key: "combat", label: "COM" },
];

export default function DetalleHeroe({ hero, statResults, playerLabel }: any) {
  if (!hero) {
    return (
      <View style={styles.container}>
        <Text style={styles.playerLabel}>{playerLabel}</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Selecciona{"\n"}una carta</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.playerLabel}>{playerLabel}</Text>
      <Image source={{ uri: hero.imageUrl }} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>
        {hero.name}
      </Text>
      <View style={styles.stats}>
        {ETIQUETAS_STATS.map(({ key, label }) => (
          <BarraEstadistica
            key={key}
            label={label}
            value={parseInt(hero.powerstats[key]) || 0}
            result={statResults ? statResults[key] : null}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
  },
  playerLabel: {
    color: "#E53935",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#0f3460",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 4,
  },
  stats: {
    width: "100%",
  },
});
