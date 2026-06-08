import { Feather } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import JobCard from "@/components/JobCard";
import { type JobCategory, useJobs } from "@/context/JobsContext";
import { useColors } from "@/hooks/useColors";

const QUICK_FILTERS: { id: JobCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "bank", label: "Bank" },
  { id: "railway", label: "Railway" },
  { id: "central", label: "Central" },
  { id: "state", label: "State" },
  { id: "psu", label: "PSU" },
];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { jobs } = useJobs();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<JobCategory | "all">("all");
  const inputRef = useRef<TextInput>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return jobs.filter((j) => {
      if (!j.isPublished) return false;
      if (filter !== "all" && j.category !== filter) return false;
      if (!q) return true;
      return (
        j.title.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.qualification.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, query, filter]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
      marginBottom: 12,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 9,
      gap: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.foreground,
      padding: 0,
    },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
    },
    chipText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: Platform.OS === "web" ? 50 : 100,
    },
    resultCount: {
      fontSize: 13,
      fontFamily: "Poppins_500Medium",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    emptyContainer: {
      alignItems: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
    },
    emptySubText: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingHorizontal: 32,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Jobs</Text>
        <View style={styles.inputRow}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search by post, organization, location..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick filters */}
      <View style={styles.filterRow}>
        {QUICK_FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.chip,
                { backgroundColor: active ? colors.primary : colors.muted },
              ]}
              onPress={() => setFilter(f.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          query.length > 0 || filter !== "all" ? (
            <Text style={styles.resultCount}>
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>
              {query.length > 0 ? "No results found" : "Start searching"}
            </Text>
            <Text style={styles.emptySubText}>
              {query.length > 0
                ? "Try different keywords or filters"
                : "Search by job title, organization, or location"}
            </Text>
          </View>
        }
      />
    </View>
  );
}
