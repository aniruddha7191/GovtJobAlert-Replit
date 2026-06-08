import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/components/JobCard";
import { type JobCategory } from "@/context/JobsContext";
import { useNotifications } from "@/context/NotificationContext";
import { useColors } from "@/hooks/useColors";

const ORDERED_CATS: Exclude<JobCategory, "all">[] = [
  "central",
  "state",
  "bank",
  "psu",
  "railway",
  "other",
];

export default function NotificationSettings() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { permissionStatus, categoryPrefs, requestPermission, toggleCategory } =
    useNotifications();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const statusColor =
    permissionStatus === "granted"
      ? colors.success
      : permissionStatus === "denied"
        ? colors.destructive
        : colors.secondary;

  const statusLabel =
    permissionStatus === "granted"
      ? "Notifications Enabled"
      : permissionStatus === "denied"
        ? "Notifications Blocked"
        : permissionStatus === "unavailable"
          ? "Not Available on Web"
          : "Notifications Disabled";

  const statusIcon: React.ComponentProps<typeof Feather>["name"] =
    permissionStatus === "granted"
      ? "check-circle"
      : permissionStatus === "denied"
        ? "x-circle"
        : "bell-off";

  const handleEnablePress = async () => {
    if (permissionStatus === "denied") {
      Alert.alert(
        "Enable Notifications",
        "Please go to your device Settings → Notifications → Govt Job Alert and enable notifications.",
        [{ text: "OK" }]
      );
      return;
    }
    if (permissionStatus === "unavailable") {
      Alert.alert("Not Supported", "Push notifications are not supported in this environment.");
      return;
    }
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Permission Denied",
        "Notifications were not enabled. You can enable them later in your device settings."
      );
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: bottomPad + 32,
      paddingTop: 16,
    },
    statusCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: statusColor + "15",
      borderRadius: 14,
      padding: 16,
      borderWidth: 1.5,
      borderColor: statusColor + "40",
      gap: 14,
      marginBottom: 20,
    },
    statusIconBg: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: statusColor + "22",
      alignItems: "center",
      justifyContent: "center",
    },
    statusLabel: {
      fontSize: 14,
      fontFamily: "Poppins_700Bold",
      color: statusColor,
    },
    statusSub: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    enableBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 7,
      marginTop: 6,
    },
    enableBtnText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
      color: "#FFFFFF",
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: "Poppins_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },
    sectionSub: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      marginBottom: 14,
      lineHeight: 18,
    },
    prefsCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    prefRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 14,
    },
    prefBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    catDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    prefLabel: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: colors.foreground,
    },
    infoCard: {
      backgroundColor: colors.primary + "10",
      borderRadius: 12,
      padding: 14,
      marginTop: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Alerts & Notifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Status Banner */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconBg}>
              <Feather name={statusIcon} size={22} color={statusColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>{statusLabel}</Text>
              <Text style={styles.statusSub}>
                {permissionStatus === "granted"
                  ? "You'll receive alerts for new government jobs"
                  : "Enable to get instant job alerts on your device"}
              </Text>
              {permissionStatus !== "granted" &&
                permissionStatus !== "unavailable" && (
                  <TouchableOpacity
                    style={styles.enableBtn}
                    onPress={handleEnablePress}
                  >
                    <Text style={styles.enableBtnText}>Enable Notifications</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>

          {/* Category Preferences */}
          <Text style={styles.sectionTitle}>Alert Categories</Text>
          <Text style={styles.sectionSub}>
            Choose which job categories you want to be notified about when new positions are published.
          </Text>

          <View style={styles.prefsCard}>
            {ORDERED_CATS.map((cat, i) => (
              <View
                key={cat}
                style={[
                  styles.prefRow,
                  i < ORDERED_CATS.length - 1 && styles.prefBorder,
                ]}
              >
                <View
                  style={[
                    styles.catDot,
                    { backgroundColor: CATEGORY_COLORS[cat] },
                  ]}
                />
                <Text style={styles.prefLabel}>{CATEGORY_LABELS[cat]}</Text>
                <Switch
                  value={categoryPrefs[cat]}
                  onValueChange={() => toggleCategory(cat)}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                  disabled={permissionStatus !== "granted"}
                />
              </View>
            ))}
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Feather name="info" size={14} color={colors.primary} style={{ marginTop: 1 }} />
            <Text style={styles.infoText}>
              You'll receive an instant alert whenever a new job matching your selected categories is published by the admin. Alerts include the post name, organization, vacancies, and last date.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
