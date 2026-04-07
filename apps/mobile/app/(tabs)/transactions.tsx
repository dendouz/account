import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";
import { apiClient } from "../../lib/api";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@studeo/shared";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("student_job");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiClient.get<{ data: Transaction[] }>("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function handleAdd() {
    if (!amount || !category) {
      Alert.alert("Erreur", "Remplis le montant et la catégorie.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/transactions", { type, amount: parseFloat(amount), category, description, date });
      setAmount("");
      setDescription("");
      await loadData();
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert("Supprimer", "Supprimer cette transaction ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try { await apiClient.delete(`/transactions/${id}`); await loadData(); } catch (err: any) { Alert.alert("Erreur", err.message); }
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type toggle */}
      <View style={styles.toggleRow}>
        <Pressable style={[styles.toggle, type === "INCOME" && styles.toggleActive]} onPress={() => { setType("INCOME"); setCategory("student_job"); }}>
          <Text style={[styles.toggleText, type === "INCOME" && styles.toggleTextActive]}>Revenu</Text>
        </Pressable>
        <Pressable style={[styles.toggle, type === "EXPENSE" && styles.toggleActive]} onPress={() => { setType("EXPENSE"); setCategory("supplies"); }}>
          <Text style={[styles.toggleText, type === "EXPENSE" && styles.toggleTextActive]}>Dépense</Text>
        </Pressable>
      </View>

      {/* Add form */}
      <View style={[styles.card, shadow.sm]}>
        <TextInput style={styles.input} placeholder="Montant (€)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
        <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
          <View style={styles.catRow}>
            {categories.map((cat) => (
              <Pressable key={cat.id} style={[styles.catChip, category === cat.id && styles.catChipActive]} onPress={() => setCategory(cat.id)}>
                <Text style={[styles.catChipText, category === cat.id && styles.catChipTextActive]}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <TextInput style={styles.input} placeholder="Description (optionnel)" value={description} onChangeText={setDescription} />
        <Pressable style={styles.button} onPress={handleAdd} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? "Ajout..." : "Ajouter"}</Text>
        </Pressable>
      </View>

      {/* List */}
      <Text style={styles.sectionTitle}>Historique</Text>
      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>Aucune transaction.</Text>
      ) : (
        transactions.map((tx) => (
          <Pressable key={tx.id} style={[styles.card, shadow.sm]} onLongPress={() => handleDelete(tx.id)}>
            <View style={styles.entryRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryTitle}>{tx.description || tx.category}</Text>
                <Text style={styles.entryDate}>{new Date(tx.date).toLocaleDateString("fr-BE")}</Text>
              </View>
              <Text style={[styles.entryAmount, { color: tx.type === "INCOME" ? colors.success[600] : colors.danger[600] }]}>
                {tx.type === "INCOME" ? "+" : "-"}€{tx.amount.toFixed(2)}
              </Text>
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
  toggleRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  toggle: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.gray[100], alignItems: "center" },
  toggleActive: { backgroundColor: colors.primary[600] },
  toggleText: { fontWeight: fontWeight.medium, color: colors.gray[500] },
  toggleTextActive: { color: colors.white },
  input: { backgroundColor: colors.gray[50], borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.base, marginBottom: spacing.sm },
  catRow: { flexDirection: "row", gap: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.gray[100] },
  catChipActive: { backgroundColor: colors.primary[100] },
  catChipText: { fontSize: fontSize.xs, color: colors.gray[600] },
  catChipTextActive: { color: colors.primary[700], fontWeight: fontWeight.medium },
  button: { backgroundColor: colors.primary[600], borderRadius: borderRadius.md, padding: spacing.md, alignItems: "center", marginTop: spacing.sm },
  buttonText: { color: colors.white, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.gray[900], marginBottom: spacing.md },
  emptyText: { color: colors.gray[400], textAlign: "center", paddingVertical: spacing["3xl"] },
  entryRow: { flexDirection: "row", alignItems: "center" },
  entryTitle: { fontSize: fontSize.base, fontWeight: fontWeight.medium, color: colors.gray[900] },
  entryDate: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  entryAmount: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});
