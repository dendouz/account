import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, FlatList, Alert, ActivityIndicator } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";
import { apiClient } from "../../lib/api";

interface WorkHour {
  id: string;
  date: string;
  hours: number;
  employer: string;
  description: string;
}

export default function HoursScreen() {
  const [entries, setEntries] = useState<WorkHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hoursInput, setHoursInput] = useState("");
  const [employer, setEmployer] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [hoursRes, summaryRes] = await Promise.all([
        apiClient.get<{ data: WorkHour[] }>("/hours"),
        apiClient.get<{ data: { totalHours: number } }>("/hours/summary"),
      ]);
      setEntries(hoursRes.data);
      setTotalHours(summaryRes.data.totalHours);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAdd() {
    if (!hoursInput || !employer) {
      Alert.alert("Erreur", "Remplis les heures et l'employeur.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/hours", {
        date,
        hours: parseFloat(hoursInput),
        employer,
        description,
      });
      setHoursInput("");
      setEmployer("");
      setDescription("");
      await loadData();
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert("Supprimer", "Supprimer cette entrée ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/hours/${id}`);
            await loadData();
          } catch (err: any) {
            Alert.alert("Erreur", err.message);
          }
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary */}
      <View style={[styles.card, shadow.md]}>
        <Text style={styles.label}>Total cette année</Text>
        <Text style={styles.bigNumber}>{totalHours}h <Text style={styles.smallText}>/ 650h</Text></Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${Math.min((totalHours / 650) * 100, 100)}%` }]} />
        </View>
      </View>

      {/* Add form */}
      <View style={[styles.card, shadow.sm]}>
        <Text style={[styles.label, { marginBottom: spacing.md }]}>Ajouter des heures</Text>
        <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <TextInput style={styles.input} placeholder="Heures (ex: 8)" value={hoursInput} onChangeText={setHoursInput} keyboardType="decimal-pad" />
        <TextInput style={styles.input} placeholder="Employeur" value={employer} onChangeText={setEmployer} />
        <TextInput style={styles.input} placeholder="Description (optionnel)" value={description} onChangeText={setDescription} />
        <Pressable style={styles.button} onPress={handleAdd} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? "Ajout..." : "Ajouter"}</Text>
        </Pressable>
      </View>

      {/* List */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Historique</Text>
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>Aucune heure enregistrée.</Text>
      ) : (
        entries.map((item) => (
          <Pressable key={item.id} style={[styles.card, shadow.sm]} onLongPress={() => handleDelete(item.id)}>
            <View style={styles.entryRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryEmployer}>{item.employer}</Text>
                <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString("fr-BE")}</Text>
                {item.description ? <Text style={styles.entryDesc}>{item.description}</Text> : null}
              </View>
              <Text style={styles.entryHours}>{item.hours}h</Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: fontSize.sm, color: colors.gray[500] },
  bigNumber: { fontSize: fontSize["3xl"], fontWeight: fontWeight.bold, color: colors.gray[900], marginTop: spacing.xs },
  smallText: { fontSize: fontSize.lg, color: colors.gray[400] },
  progressBg: { height: 8, backgroundColor: colors.gray[100], borderRadius: borderRadius.full, marginTop: spacing.md, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: borderRadius.full, backgroundColor: colors.primary[500] },
  input: { backgroundColor: colors.gray[50], borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.base, marginBottom: spacing.sm },
  button: { backgroundColor: colors.primary[600], borderRadius: borderRadius.md, padding: spacing.md, alignItems: "center", marginTop: spacing.sm },
  buttonText: { color: colors.white, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.gray[900], marginBottom: spacing.md },
  emptyText: { color: colors.gray[400], textAlign: "center", paddingVertical: spacing["3xl"] },
  entryRow: { flexDirection: "row", alignItems: "center" },
  entryEmployer: { fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.gray[900] },
  entryDate: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  entryDesc: { fontSize: fontSize.sm, color: colors.gray[500], marginTop: 2 },
  entryHours: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary[600] },
});
