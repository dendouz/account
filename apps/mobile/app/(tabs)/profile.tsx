import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";
import { api } from "../../lib/api";
import { logout as authLogout } from "../../lib/auth";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentStatus: string;
  region: string;
}

const STATUS_LABELS: Record<string, string> = {
  JOBISTE: "Étudiant jobiste",
  INDEPENDENT: "Étudiant indépendant",
  ENTREPRENEUR: "Étudiant entrepreneur",
  OTHER: "Autre",
};

const REGION_LABELS: Record<string, string> = {
  BRUSSELS: "Bruxelles",
  WALLONIA: "Wallonie",
  FLANDERS: "Flandre",
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<User>("/profile")
      .then((u) => setUser(u))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    Alert.alert("Déconnexion", "Es-tu sûr de vouloir te déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await authLogout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile card */}
      <View style={[styles.card, shadow.md]}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Statut</Text>
            <Text style={styles.infoValue}>{STATUS_LABELS[user?.studentStatus || "OTHER"]}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Région</Text>
            <Text style={styles.infoValue}>{REGION_LABELS[user?.region || "BRUSSELS"]}</Text>
          </View>
        </View>
      </View>

      {/* Menu items */}
      <Text style={styles.sectionTitle}>Plus</Text>
      {[
        { icon: "checkmark-circle-outline" as const, label: "Mes obligations", route: "obligations" },
        { icon: "calculator-outline" as const, label: "Simulateur fiscal", route: "simulator" },
        { icon: "book-outline" as const, label: "Guide pratique", route: "knowledge" },
      ].map((item) => (
        <Pressable key={item.route} style={[styles.menuItem, shadow.sm]}>
          <Ionicons name={item.icon} size={22} color={colors.primary[600]} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
        </Pressable>
      ))}

      {/* Logout */}
      <Pressable style={[styles.logoutButton, shadow.sm]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger[600]} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </Pressable>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Studeo fournit des estimations à titre indicatif. Consulte un professionnel pour ta situation personnelle.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary[100], justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary[600] },
  name: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.gray[900] },
  email: { fontSize: fontSize.sm, color: colors.gray[500] },
  infoRow: { flexDirection: "row", gap: spacing.md },
  infoItem: { flex: 1, backgroundColor: colors.gray[50], borderRadius: borderRadius.md, padding: spacing.md },
  infoLabel: { fontSize: fontSize.xs, color: colors.gray[400], marginBottom: 2 },
  infoValue: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.gray[900] },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.gray[900], marginBottom: spacing.md },
  menuItem: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  menuLabel: { flex: 1, fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.gray[900] },
  logoutButton: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginTop: spacing.xl, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.danger[100] },
  logoutText: { fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.danger[600] },
  disclaimer: { marginTop: spacing.xl, padding: spacing.md },
  disclaimerText: { fontSize: fontSize.xs, color: colors.gray[400], textAlign: "center", lineHeight: 18 },
});
