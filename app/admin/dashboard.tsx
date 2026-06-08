import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORY_LABELS } from "@/components/JobCard";
import { useAdmin } from "@/context/AdminContext";
import { type Job, useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

function KPICard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  const colors = useColors();
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      alignItems: "flex-start",
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconBg: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    value: {
      fontSize: 22,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
    },
    label: {
      fontSize: 11,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
  });
  return (
    <View style={styles.card}>
      <View style={[styles.iconBg, { backgroundColor: color + "22" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const { jobs, savedIds, deleteJob, updateJob } = useJobs();
  const [showAll, setShowAll] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const totalViews = useMemo(
    () => jobs.reduce((s, j) => s + j.views, 0),
    [jobs]
  );
  const activeJobs = useMemo(
    () => jobs.filter((j) => j.isPublished).length,
    [jobs]
  );
  const displayJobs = useMemo(
    () => (showAll ? jobs : jobs.slice(0, 10)),
    [showAll, jobs]
  );

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const handleDelete = (job: Job) => {
    Alert.alert(
      "Delete Job",
      `Delete "${job.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteJob(job.id),
        },
      ]
    );
  };

  const handleTogglePublish = (job: Job) => {
    updateJob(job.id, { isPublished: !job.isPublished });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    backBtn: { padding: 4 },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    adminBadge: {
      backgroundColor: colors.secondary,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    adminBadgeText: {
      fontSize: 10,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: bottomPad + 32,
    },
    kpiRow: {
      flexDirection: "row",
      gap: 10,
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
      marginBottom: 12,
    },
    addBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    addBtnText: {
      fontSize: 14,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    jobRow: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    jobTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    jobTitle: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
      marginRight: 8,
    },
    jobOrg: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      marginBottom: 10,
    },
    actionRow: {
      flexDirection: "row",
      gap: 8,
    },
    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "15",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 4,
    },
    editBtnText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
      color: colors.primary,
    },
    deleteBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.destructive + "15",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 4,
    },
    deleteBtnText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
      color: colors.destructive,
    },
    statusChip: {
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    statusChipText: {
      fontSize: 10,
      fontFamily: "Poppins_700Bold",
    },
    showMoreBtn: {
      alignItems: "center",
      paddingVertical: 14,
    },
    showMoreText: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={displayJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* KPI Cards */}
            <View style={styles.kpiRow}>
              <KPICard label="Total Jobs" value={jobs.length} icon="briefcase" color={colors.primary} />
              <KPICard label="Active Jobs" value={activeJobs} icon="check-circle" color="#22C55E" />
            </View>
            <View style={[styles.kpiRow, { marginTop: 0, marginBottom: 0 }]}>
              <KPICard label="Total Views" value={totalViews.toLocaleString("en-IN")} icon="eye" color="#FF8C00" />
              <KPICard label="Bookmarks" value={savedIds.length} icon="bookmark" color="#7C3AED" />
            </View>

            {/* Add Job Button */}
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                { marginTop: 16, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => router.push("/admin/add-job")}
            >
              <Feather name="plus-circle" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add New Job</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Manage Jobs ({jobs.length})</Text>
          </>
        }
        renderItem={({ item: job }) => (
          <View style={styles.jobRow}>
            <View style={styles.jobTop}>
              <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
              <TouchableOpacity
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: job.isPublished
                      ? "#22C55E22"
                      : colors.destructive + "22",
                  },
                ]}
                onPress={() => handleTogglePublish(job)}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    { color: job.isPublished ? "#22C55E" : colors.destructive },
                  ]}
                >
                  {job.isPublished ? "PUBLISHED" : "UNPUBLISHED"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.jobOrg} numberOfLines={1}>
              {job.organization} • {CATEGORY_LABELS[job.category]}
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({ pathname: "/admin/add-job", params: { id: job.id } })
                }
              >
                <Feather name="edit-2" size={12} color={colors.primary} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(job)}
              >
                <Feather name="trash-2" size={12} color={colors.destructive} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          jobs.length > 10 ? (
            <TouchableOpacity
              style={styles.showMoreBtn}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={styles.showMoreText}>
                {showAll ? "Show Less" : `Show All ${jobs.length} Jobs`}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
