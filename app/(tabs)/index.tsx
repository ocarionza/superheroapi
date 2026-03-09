import TarjetaHeroe from "@/components/TarjetaHeroe/TarjetaHeroe";
import DetalleHeroe from "@/components/DetalleHeroe/DetalleHeroe";
import { useReemplazoHeroe } from "@/components/ContextoReemplazoHeroe/ContextoReemplazoHeroe";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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

const CLAVES_STATS = [
  "intelligence",
  "strength",
  "speed",
  "durability",
  "power",
  "combat",
];

function compararHeroes(heroe1: any, heroe2: any) {
  const resultadosJ1: any = {};
  const resultadosJ2: any = {};
  let puntajeJ1 = 0;
  let puntajeJ2 = 0;

  for (const clave of CLAVES_STATS) {
    const v1 = parseInt(heroe1.powerstats[clave]) || 0;
    const v2 = parseInt(heroe2.powerstats[clave]) || 0;

    if (v1 > v2) {
      resultadosJ1[clave] = "win";
      resultadosJ2[clave] = "lose";
      puntajeJ1++;
    } else if (v2 > v1) {
      resultadosJ1[clave] = "lose";
      resultadosJ2[clave] = "win";
      puntajeJ2++;
    } else {
      resultadosJ1[clave] = "tie";
      resultadosJ2[clave] = "tie";
    }
  }

  const ganador = puntajeJ1 > puntajeJ2 ? 1 : puntajeJ2 > puntajeJ1 ? 2 : 0;
  return { resultadosJ1, resultadosJ2, ganador };
}

async function obtenerHeroe(id: number) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}/powerstats`);
    const data = res.data;

    if (data.response === "error") return null;

    return {
      id: data.id,
      name: data.name,
      powerstats: {
        intelligence: data.intelligence,
        strength: data.strength,
        speed: data.speed,
        durability: data.durability,
        power: data.power,
        combat: data.combat,
      },
      imageUrl: obtenerUrlImagen(data.id, data.name),
    };
  } catch {
    return null;
  }
}

export default function PantallaJuego() {
  const router = useRouter();
  const { reemplazo, setReemplazo } = useReemplazoHeroe();

  const [cargando, setCargando] = useState(true);
  const [heroesJ1, setHeroesJ1] = useState<any[]>([]);
  const [heroesJ2, setHeroesJ2] = useState<any[]>([]);
  const [seleccionJ1, setSeleccionJ1] = useState<any>(null);
  const [seleccionJ2, setSeleccionJ2] = useState<any>(null);
  const [resultadosJ1, setResultadosJ1] = useState<any>(null);
  const [resultadosJ2, setResultadosJ2] = useState<any>(null);
  const [ganador, setGanador] = useState<any>(null);

  // Revancha: cada jugador puede buscar un reemplazo 1 vez
  const [j1UsoReemplazo, setJ1UsoReemplazo] = useState(false);
  const [j2UsoReemplazo, setJ2UsoReemplazo] = useState(false);

  const cargarRonda = useCallback(async () => {
    setCargando(true);
    setSeleccionJ1(null);
    setSeleccionJ2(null);
    setResultadosJ1(null);
    setResultadosJ2(null);
    setGanador(null);
    setJ1UsoReemplazo(false);
    setJ2UsoReemplazo(false);

    const heroes: any[] = [];
    const idsUsados = new Set();

    while (heroes.length < 8) {
      const lote = [];
      const necesarios = 8 - heroes.length;

      for (let i = 0; i < necesarios + 2; i++) {
        let id;
        do {
          id = Math.floor(Math.random() * 731) + 1;
        } while (idsUsados.has(id));
        idsUsados.add(id);
        lote.push(obtenerHeroe(id));
      }

      const resultados = await Promise.all(lote);
      for (const heroe of resultados) {
        if (heroe && heroes.length < 8) {
          heroes.push(heroe);
        }
      }
    }

    setHeroesJ1(heroes.slice(0, 4));
    setHeroesJ2(heroes.slice(4, 8));
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarRonda();
  }, [cargarRonda]);

  useEffect(() => {
    if (seleccionJ1 && seleccionJ2) {
      const resultado = compararHeroes(seleccionJ1, seleccionJ2);
      setResultadosJ1(resultado.resultadosJ1);
      setResultadosJ2(resultado.resultadosJ2);
      setGanador(resultado.ganador);
    }
  }, [seleccionJ1, seleccionJ2]);

  // Escuchar cuando se selecciona un reemplazo desde la pantalla de búsqueda
  useEffect(() => {
    if (!reemplazo) return;

    const { hero, player } = reemplazo;

    if (player === 1) {
      const nuevosHeroes = heroesJ1.map((h: any) =>
        h.id === seleccionJ1?.id ? hero : h,
      );
      setHeroesJ1(nuevosHeroes);
      setJ1UsoReemplazo(true);
    } else {
      const nuevosHeroes = heroesJ2.map((h: any) =>
        h.id === seleccionJ2?.id ? hero : h,
      );
      setHeroesJ2(nuevosHeroes);
      setJ2UsoReemplazo(true);
    }

    setSeleccionJ1(null);
    setSeleccionJ2(null);
    setResultadosJ1(null);
    setResultadosJ2(null);
    setGanador(null);
    setReemplazo(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reemplazo]);

  // Navegar a la pantalla de búsqueda de reemplazo
  const abrirPantallaReemplazo = (jugador: number) => {
    router.push({ pathname: "/reemplazar-heroe" as any, params: { player: String(jugador) } });
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Cargando héroes...</Text>
      </View>
    );
  }

  const rondaTerminada = ganador !== null;
  // El perdedor puede buscar reemplazo si no ha usado su reemplazo
  const j1PuedeReemplazar = rondaTerminada && ganador === 2 && !j1UsoReemplazo;
  const j2PuedeReemplazar = rondaTerminada && ganador === 1 && !j2UsoReemplazo;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.sectionLabel}>Jugador 1</Text>

      <View style={styles.cardsRow}>
        {heroesJ1.map((hero: any) => (
          <TarjetaHeroe
            key={hero.id}
            hero={hero}
            onPress={() => {
              if (j1PuedeReemplazar && seleccionJ1?.id === hero.id) {
                abrirPantallaReemplazo(1);
              } else if (!rondaTerminada && seleccionJ1 === null) {
                setSeleccionJ1(hero);
              }
            }}
            disabled={
              rondaTerminada
                ? !(j1PuedeReemplazar && seleccionJ1?.id === hero.id)
                : seleccionJ1 !== null
            }
            isSelected={seleccionJ1?.id === hero.id}
            isLoser={rondaTerminada && ganador === 2 && seleccionJ1?.id === hero.id}
          />
        ))}
      </View>

      {j1PuedeReemplazar && (
        <Text style={styles.replaceHint}>
          Toca tu carta gris para buscar un reemplazo
        </Text>
      )}

      <View style={styles.battleArea}>
        <DetalleHeroe
          hero={seleccionJ1}
          statResults={resultadosJ1}
          playerLabel="Jugador 1"
        />
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <DetalleHeroe
          hero={seleccionJ2}
          statResults={resultadosJ2}
          playerLabel="Jugador 2"
        />
      </View>

      {rondaTerminada && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>
            {ganador === 0 ? "¡Empate!" : `¡Jugador ${ganador} gana!`}
          </Text>
        </View>
      )}

      {j2PuedeReemplazar && (
        <Text style={styles.replaceHint}>
          Toca tu carta gris para buscar un reemplazo
        </Text>
      )}

      <View style={styles.cardsRow}>
        {heroesJ2.map((hero: any) => (
          <TarjetaHeroe
            key={hero.id}
            hero={hero}
            onPress={() => {
              if (j2PuedeReemplazar && seleccionJ2?.id === hero.id) {
                abrirPantallaReemplazo(2);
              } else if (!rondaTerminada && seleccionJ2 === null) {
                setSeleccionJ2(hero);
              }
            }}
            disabled={
              rondaTerminada
                ? !(j2PuedeReemplazar && seleccionJ2?.id === hero.id)
                : seleccionJ2 !== null
            }
            isSelected={seleccionJ2?.id === hero.id}
            isLoser={rondaTerminada && ganador === 1 && seleccionJ2?.id === hero.id}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Jugador 2</Text>

      {rondaTerminada && (
        <TouchableOpacity style={styles.nextButton} onPress={cargarRonda}>
          <Text style={styles.nextButtonText}>Siguiente Ronda</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#0a0a23",
  },
  container: {
    padding: 12,
    paddingBottom: 30,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a23",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  sectionLabel: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginVertical: 6,
    letterSpacing: 1,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 8,
  },
  battleArea: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  vsContainer: {
    paddingHorizontal: 6,
  },
  vsText: {
    color: "#E53935",
    fontSize: 22,
    fontWeight: "bold",
  },
  winnerBanner: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 8,
  },
  winnerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  replaceHint: {
    color: "#FFC107",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  nextButton: {
    backgroundColor: "#0f3460",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 12,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
