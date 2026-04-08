import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";
import { api } from "../../lib/api";
import { DOCUMENT_TYPE_LABELS } from "../../lib/constants";

interface Document {
  id: string;
  type: string;
  fileName: string;
  uploadedAt: string;
}

const DOC_TYPES = Object.entries(DOCUMENT_TYPE_LABELS);

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("RECEIPT");

  const loadData = useCallback(async () => {
    try {
      const docs = await api.get<Document[]>("/documents");
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function pickAndUpload() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      await api.upload(
        "/documents/upload",
        asset.uri,
        asset.fileName || "document.jpg",
        asset.mimeType || "image/jpeg",
        { type: selectedType }
      );
      await loadData();
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert("Supprimer", "Supprimer ce document ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try { await api.delete(`/documents/${id}`); await loadData(); } catch (err: any) { Alert.alert("Erreur", err.message); }
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Type selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        <View style={styles.typeRow}>
          {DOC_TYPES.map(([key, label]) => (
            <Pressable
              key={key}
              style={[styles.typeChip, selectedType === key && styles.typeChipActive]}
              onPress={() => setSelectedType(key)}
            >
              <Text style={[styles.typeChipText, selectedType === key && styles.typeChipTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Upload button */}
      <Pressable style={[styles.uploadButton, shadow.sm]} onPress={pickAndUpload} disabled={uploading}>
        <Text style={styles.uploadButtonText}>
          {uploading ? "Upload en cours..." : "Ajouter un document"}
        </Text>
      </Pressable>

      {/* Document list */}
      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun document</Text>
          <Text style={styles.emptySubtext}>Ajoute tes fiches de paie, reçus et contrats.</Text>
        </View>
      ) : (
        documents.map((doc) => (
          <Pressable key={doc.id} style={[styles.card, shadow.sm]} onLongPress={() => handleDelete(doc.id)}>
            <View style={styles.docRow}>
              <View style={styles.docIcon}>
                <Text style={styles.docIconText}>
                  {doc.fileName.match(/\.(jpg|jpeg|png)$/i) ? "IMG" : "PDF"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.docName} numberOfLines={1}>{doc.fileName}</Text>
                <Text style={styles.docType}>{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</Text>
                <Text style={styles.docDate}>{new Date(doc.uploadedAt).toLocaleDateString("fr-BE")}</Text>
              </View>
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
  typeRow: { flexDirection: "row", gap: spacing.sm },
  typeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.gray[100] },
  typeChipActive: { backgroundColor: colors.primary[100] },
  typeChipText: { fontSize: fontSize.xs, color: colors.gray[600] },
  typeChipTextActive: { color: colors.primary[700], fontWeight: fontWeight.medium },
  uploadButton: { backgroundColor: colors.primary[600], borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center", marginBottom: spacing.lg },
  uploadButtonText: { color: colors.white, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  emptyContainer: { alignItems: "center", paddingVertical: spacing["5xl"] },
  emptyText: { fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.gray[400] },
  emptySubtext: { fontSize: fontSize.sm, color: colors.gray[400], marginTop: spacing.xs },
  docRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  docIcon: { width: 44, height: 44, backgroundColor: colors.gray[100], borderRadius: borderRadius.md, justifyContent: "center", alignItems: "center" },
  docIconText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.gray[500] },
  docName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.gray[900] },
  docType: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: 2 },
  docDate: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
});
