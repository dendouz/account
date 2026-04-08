import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";
import { api } from "../../lib/api";

interface HoursSummary {
  totalHours: number;
  remainingHours: number;
  maxHours: number;
  percentUsed: number;
}

interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

export default function DashboardScreen() {
  const [hours, setHours] = useState<HoursSummary | null>(null);
  const [txSummary, setTxSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<HoursSummary>("/hours/summary").then((r) => setHours(r)),
      api.get<TransactionSummary>("/transactions/summary").then((r) => setTxSummary(r)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  const hoursPercent = hours ? Math.min(hours.percentUsed, 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Bonjour !</Text>
      <Text style={styles.subtitle}>Voici ta situation en un coup d&apos;œil.</Text>

      {/* Hours card */}
      <View style={[styles.card, shadow.md]}>
        <Text style={styles.cardLabel}>Heures utilisées</Text>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursValue}>{hours?.totalHours ?? 0}</Text>
          <Text style={styles.hoursMax}>/ {hours?.maxHours ?? 650}</Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${hoursPercent}%`,
                backgroundColor:
                  hoursPercent >= 90 ? colors.danger[500] : hoursPercent >= 70 ? colors.warning[500] : colors.primary[500],
              },
            ]}
          />
        </View>
        <Text style={styles.hoursRemaining}>{hours?.remainingHours ?? 650}h restantes</Text>
      </View>

      {/* Finance cards */}
      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard, shadow.sm]}>
          <Text style={styles.cardLabel}>Revenus</Text>
          <Text style={[styles.statValue, { color: colors.success[600] }]}>
            €{txSummary?.totalIncome?.toLocaleString("fr-BE") ?? "0"}
          </Text>
        </View>
        <View style={[styles.card, styles.halfCard, shadow.sm]}>
          <Text style={styles.cardLabel}>Dépenses</Text>
          <Text style={[styles.statValue, { color: colors.danger[600] }]}>
            €{txSummary?.totalExpenses?.toLocaleString("fr-BE") ?? "0"}
          </Text>
        </View>
      </View>

      <View style={[styles.card, shadow.sm]}>
        <Text style={styles.cardLabel}>Revenu net</Text>
        <Text style={[styles.bigValue, { color: colors.primary[600] }]}>
          €{txSummary?.netAmount?.toLocaleString("fr-BE") ?? "0"}
        </Text>
      </View>

      {/* Next deadline */}
      <View style={[styles.card, shadow.sm, { backgroundColor: colors.warning[50] }]}>
        <Text style={[styles.cardLabel, { color: colors.warning[700] }]}>Prochaine échéance</Text>
        <Text style={[styles.deadlineText, { color: colors.warning[700] }]}>15 juillet 2026</Text>
        <Text style={[styles.deadlineDesc, { color: colors.warning[600] }]}>Déclaration fiscale en ligne</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  greeting: { fontSize: fontSize["2xl"], fontWeight: fontWeight.bold, color: colors.gray[900], marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.base, color: colors.gray[500], marginBottom: spacing.xl },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.sm },
  hoursRow: { flexDirection: "row", alignItems: "baseline" },
  hoursValue: { fontSize: fontSize["4xl"], fontWeight: fontWeight.bold, color: colors.gray[900] },
  hoursMax: { fontSize: fontSize.lg, color: colors.gray[400], marginLeft: spacing.xs },
  progressBg: { height: 8, backgroundColor: colors.gray[100], borderRadius: borderRadius.full, marginTop: spacing.md, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: borderRadius.full },
  hoursRemaining: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.sm },
  row: { flexDirection: "row", gap: spacing.md },
  halfCard: { flex: 1 },
  statValue: { fontSize: fontSize["2xl"], fontWeight: fontWeight.bold },
  bigValue: { fontSize: fontSize["3xl"], fontWeight: fontWeight.bold },
  deadlineText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  deadlineDesc: { fontSize: fontSize.sm, marginTop: spacing.xs },
});
