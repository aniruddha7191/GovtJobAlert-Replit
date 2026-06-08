import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import JobCard from "@/components/JobCard";
import { useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { jobs, savedIds } = useJobs();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const savedJobs = useMemo(
    () => jobs.filter((j) => savedIds.includes(j.id)),
    [jobs, savedIds]
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    badge: {
      backgroundColor: "rgba(255,255,255,0.25)",
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    badgeText: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: "#FFFFFF",
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: Platform.OS === "web" ? 50 : 100,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      gap: 14,
    },
    emptyIconBg: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
    },
    emptyText: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingHorizontal: 40,
      lineHeight: 20,
    },
    browseBtn: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginTop: 6,
    },
    browseBtnText: {
      fontSize: 14,
      fontFamily: "Poppins_600SemiBold",
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Saved Jobs</Text>
          {savedJobs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{savedJobs.length}</Text>
            </View>
          )}
        </View>
      </View>

      {savedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBg}>
            <Feather name="bookmark" size={40} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Jobs</Text>
          <Text style={styles.emptyText}>
            Bookmark jobs you like and find them here anytime, even offline.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/(tabs)/")}
          >
            <Text style={styles.browseBtnText}>Browse Jobs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={savedJobs.length > 0}
        />
      )}
    </View>
  );
}
