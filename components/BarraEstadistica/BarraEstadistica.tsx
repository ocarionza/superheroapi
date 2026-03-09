import { StyleSheet, Text, View } from "react-native";

export default function BarraEstadistica({ label, value, result }: any) {
  const colorBarra =
    result === "win" ? "#4CAF50" : result === "lose" ? "#F44336" : "#888";

  const anchoBarra = Math.max(value, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.bar,
            { width: `${anchoBarra}%`, backgroundColor: colorBarra },
          ]}
        />
      </View>
      <Text style={[styles.value, { color: colorBarra }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  label: {
    color: "#ccc",
    fontSize: 9,
    width: 32,
    textTransform: "uppercase",
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 4,
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    width: 24,
    textAlign: "right",
  },
});
