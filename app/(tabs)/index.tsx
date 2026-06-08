import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import JobCard from "@/components/JobCard";
import { type JobCategory, useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { id: JobCategory; label: string }[] = [
  { id: "all", label: "All Jobs" },
  { id: "central", label: "Central Govt" },
  { id: "state", label: "State Govt" },
  { id: "bank", label: "Bank Jobs" },
  { id: "psu", label: "PSU Jobs" },
  { id: "railway", label: "Railway" },
  { id: "other", label: "Other" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { jobs, loading } = useJobs();
  const [activeCategory, setActiveCategory] = useState<JobCategory>("all");

  const filtered = useMemo(() => {
    const pub = jobs.filter((j) => j.isPublished);
    if (activeCategory === "all") return pub;
    return pub.filter((j) => j.category === activeCategory);
  }, [jobs, activeCategory]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    headerSub: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: "rgba(255,255,255,0.75)",
      marginTop: -4,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    searchText: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: "rgba(255,255,255,0.7)",
      flex: 1,
    },
    categoryScroll: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1.5,
    },
    chipText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: Platform.OS === "web" ? 50 : 100,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
    },
    countBadge: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    countText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
      color: colors.mutedForeground,
    },
    emptyContainer: {
      alignItems: "center",
      paddingTop: 60,
      gap: 10,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
    },
    emptySubText: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Govt Job Alert</Text>
            <Text style={styles.headerSub}>Latest Government Jobs Across India</Text>
          </View>
          <Feather name="bell" size={22} color="#FFFFFF" />
        </View>
        <Pressable style={styles.searchBar} onPress={() => router.push("/(tabs)/search")}>
          <Feather name="search" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.searchText}>Search jobs, organizations...</Text>
        </Pressable>
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ paddingRight: 8 }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.muted,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Jobs List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Jobs</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filtered.length} Jobs</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="briefcase" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No jobs found</Text>
            <Text style={styles.emptySubText}>Try a different category</Text>
          </View>
        }
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
}
