import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/JobCard";
import { useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      width: 130,
      fontSize: 13,
      fontFamily: "Poppins_500Medium",
      color: colors.mutedForeground,
    },
    value: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
    },
  });
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, savedIds, toggleSave, incrementViews } = useJobs();

  const job = jobs.find((j) => j.id === id);
  const isSaved = savedIds.includes(id ?? "");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (job) incrementViews(job.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!job) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.foreground }}>
          Job not found
        </Text>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[job.category];
  const catLabel = CATEGORY_LABELS[job.category];

  const handleApply = () => {
    if (job.applyLink) {
      Linking.openURL(job.applyLink).catch(() =>
        Alert.alert("Error", "Could not open the apply link.")
      );
    }
  };

  const handleNotification = () => {
    if (job.notificationLink) {
      Linking.openURL(job.notificationLink).catch(() =>
        Alert.alert("Error", "Could not open the notification link.")
      );
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: topPad + 8,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      justifyContent: "space-between",
    },
    navBack: { padding: 4 },
    navTitle: {
      fontSize: 16,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 8,
    },
    heroCard: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    heroBadge: {
      alignSelf: "flex-start",
      backgroundColor: catColor + "33",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: catColor + "55",
    },
    heroBadgeText: {
      fontSize: 12,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    heroTitle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
      lineHeight: 26,
      marginBottom: 6,
    },
    heroOrg: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: "rgba(255,255,255,0.8)",
      marginBottom: 14,
    },
    heroStats: {
      flexDirection: "row",
      gap: 16,
    },
    heroStat: { alignItems: "center" },
    heroStatNum: {
      fontSize: 16,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    heroStatLabel: {
      fontSize: 10,
      fontFamily: "Poppins_400Regular",
      color: "rgba(255,255,255,0.7)",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: bottomPad + 32,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: "Poppins_700Bold",
      color: colors.primary,
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary + "22",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tableLabel: {
      width: 140,
      fontSize: 13,
      fontFamily: "Poppins_500Medium",
      color: colors.mutedForeground,
    },
    tableValue: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 4,
    },
    notifBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      gap: 6,
    },
    notifBtnText: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.primary,
    },
    applyBtnInline: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.secondary,
      borderRadius: 10,
      paddingVertical: 12,
      gap: 6,
    },
    applyBtnInlineText: {
      fontSize: 13,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    stickyApplyBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingBottom: bottomPad + 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    stickyApplyBtn: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    stickyApplyText: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navBack} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Job Details</Text>
        <TouchableOpacity style={styles.navBack} onPress={() => toggleSave(job.id)}>
          <Feather
            name="bookmark"
            size={22}
            color="#FFFFFF"
            style={{ opacity: isSaved ? 1 : 0.6 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{catLabel}</Text>
          </View>
          <Text style={styles.heroTitle}>{job.title}</Text>
          <Text style={styles.heroOrg}>{job.organization}</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{job.vacancies}</Text>
              <Text style={styles.heroStatLabel}>Vacancies</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{job.ageLimit}</Text>
              <Text style={styles.heroStatLabel}>Age Limit</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{job.views}</Text>
              <Text style={styles.heroStatLabel}>Views</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Basic Info */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <InfoRow label="Post Name" value={job.title} />
            <InfoRow label="Organization" value={job.organization} />
            <InfoRow label="Category" value={catLabel} />
            <InfoRow label="Qualification" value={job.qualification} />
            <InfoRow label="Vacancies" value={job.vacancies} />
            <InfoRow label="Location" value={job.location} />
          </View>

          {/* Important Dates */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Important Dates</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Start Date</Text>
              <Text style={styles.tableValue}>{job.startDate}</Text>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.tableLabel}>Last Date</Text>
              <Text style={[styles.tableValue, { color: colors.destructive }]}>{job.endDate}</Text>
            </View>
          </View>

          {/* Application Fee */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Application Fee</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>General / OBC</Text>
              <Text style={styles.tableValue}>{job.generalFee}</Text>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.tableLabel}>SC / ST / PH</Text>
              <Text style={styles.tableValue}>{job.scstFee}</Text>
            </View>
          </View>

          {/* Eligibility */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Eligibility</Text>
            <InfoRow label="Qualification" value={job.qualification} />
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.tableLabel}>Age Limit</Text>
              <Text style={styles.tableValue}>{job.ageLimit}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.notifBtn} onPress={handleNotification}>
              <Feather name="file-text" size={15} color={colors.primary} />
              <Text style={styles.notifBtnText}>Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtnInline} onPress={handleApply}>
              <Feather name="external-link" size={15} color="#FFFFFF" />
              <Text style={styles.applyBtnInlineText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </View>
  );
}
