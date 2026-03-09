import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import ContenidoDetalleHeroe from "@/components/ContenidoDetalleHeroe/ContenidoDetalleHeroe";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function getImageUrl(id: any, name: any) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/${id}-${slug}.jpg`;
}

export default function HeroDetailScreen() {
  const { id } = useLocalSearchParams();
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const [powerstatsRes, bioRes, appearanceRes] = await Promise.all([
          axios.get(`${BASE_URL}/${id}/powerstats`),
          axios.get(`${BASE_URL}/${id}/biography`),
          axios.get(`${BASE_URL}/${id}/appearance`),
        ]);

        setHero({
          id: id,
          name: powerstatsRes.data.name,
          imageUrl: getImageUrl(id, powerstatsRes.data.name),
          powerstats: powerstatsRes.data,
          biography: bioRes.data,
          appearance: appearanceRes.data,
        });
      } catch {
        setHero(null);
      }
      setLoading(false);
    };

    fetchHero();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Cargando héroe...</Text>
      </View>
    );
  }

  if (!hero) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el héroe</Text>
      </View>
    );
  }

  return <ContenidoDetalleHeroe hero={hero} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0a0a23",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#E53935",
    fontSize: 16,
  },
});
