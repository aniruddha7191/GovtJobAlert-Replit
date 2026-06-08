import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { type Job, type JobCategory, useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_COLORS: Record<Exclude<JobCategory, "all">, string> = {
  central: "#0F4C81",
  state: "#7C3AED",
  bank: "#059669",
  psu: "#D97706",
  railway: "#DC2626",
  other: "#6B7280",
};

const CATEGORY_LABELS: Record<Exclude<JobCategory, "all">, string> = {
  central: "Central Govt",
  state: "State Govt",
  bank: "Bank",
  psu: "PSU",
  railway: "Railway",
  other: "Other",
};

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { savedIds, toggleSave } = useJobs();
  const isSaved = savedIds.includes(job.id);
  const catColor = CATEGORY_COLORS[job.category];

  const handlePress = useCallback(() => {
    router.push(`/job/${job.id}`);
  }, [job.id, router]);

  const handleSave = useCallback(() => {
    toggleSave(job.id);
  }, [job.id, toggleSave]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    badge: {
      backgroundColor: catColor + "1A",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Poppins_600SemiBold",
      color: catColor,
    },
    saveBtn: {
      padding: 4,
    },
    title: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
      marginBottom: 4,
      lineHeight: 22,
    },
    org: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 12,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateText: {
      fontSize: 11,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    viewBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    viewBtnText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
      color: colors.primaryForeground,
    },
  });

  return (
    <Pressable style={({ pressed }) => [styles.card, { opacity: pressed ? 0.95 : 1 }]} onPress={handlePress}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{CATEGORY_LABELS[job.category]}</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} hitSlop={8}>
          <Feather
            name={isSaved ? "bookmark" : "bookmark"}
            size={20}
            color={isSaved ? colors.secondary : colors.mutedForeground}
            style={{ opacity: isSaved ? 1 : 0.6 }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
      <Text style={styles.org} numberOfLines={1}>{job.organization}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="award" size={12} color={colors.mutedForeground} />
          <Text style={styles.metaText} numberOfLines={1}>{job.qualification}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={styles.metaText}>{job.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="users" size={12} color={colors.mutedForeground} />
          <Text style={styles.metaText}>{job.vacancies} Posts</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Text style={styles.dateText}>Last Date: {job.endDate}</Text>
        <TouchableOpacity style={styles.viewBtn} onPress={handlePress}>
          <Text style={styles.viewBtnText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

export { CATEGORY_COLORS, CATEGORY_LABELS };
