import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TarjetaHeroe({
  hero,
  onPress,
  disabled,
  isLoser,
  isSelected,
}: any) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selected,
        isLoser && styles.loser,
      ]}
      onPress={() => onPress(hero)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, isLoser && styles.greyOverlay]}>
        <Image source={{ uri: hero.imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {hero.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80,
    alignItems: "center",
    backgroundColor: "#16213e",
    borderRadius: 10,
    padding: 4,
    borderWidth: 2,
    borderColor: "#0f3460",
  },
  selected: {
    borderColor: "#E53935",
    borderWidth: 2,
  },
  loser: {
    opacity: 0.35,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
  },
  greyOverlay: {
    opacity: 0.5,
  },
  image: {
    width: 70,
    height: 70,
  },
  name: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});
