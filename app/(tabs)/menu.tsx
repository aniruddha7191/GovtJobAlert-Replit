import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAdmin } from "@/context/AdminContext";
import { useNotifications } from "@/context/NotificationContext";
import { useColors } from "@/hooks/useColors";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface MenuItem {
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
  color?: string;
  badge?: string;
}

export default function MenuScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAdmin, logout } = useAdmin();
  const { permissionStatus } = useNotifications();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Get the latest Government Jobs with Govt Job Alert! India's trusted government job portal.",
      });
    } catch {}
  };

  const handleLogout = () => {
    Alert.alert("Admin Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const jobMenuItems: MenuItem[] = [
    {
      icon: "briefcase",
      label: "All Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
    {
      icon: "flag",
      label: "Central Govt Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
    {
      icon: "map",
      label: "State Govt Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
    {
      icon: "credit-card",
      label: "Bank Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
    {
      icon: "database",
      label: "PSU Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
    {
      icon: "navigation",
      label: "Railway Jobs",
      onPress: () => router.push("/(tabs)/"),
    },
  ];

  const infoMenuItems: MenuItem[] = [
    {
      icon: "info",
      label: "About App",
      onPress: () =>
        Alert.alert(
          "Govt Job Alert",
          "Version 1.0.0\n\nIndia's Trusted Government Job Portal.\n\nDiscover latest central, state, bank, PSU, and railway government jobs all in one place."
        ),
    },
    {
      icon: "shield",
      label: "Privacy Policy",
      onPress: () =>
        Alert.alert(
          "Privacy Policy",
          "We respect your privacy. We do not collect or sell any personal information."
        ),
    },
    {
      icon: "mail",
      label: "Contact Us",
      onPress: () =>
        Alert.alert("Contact Us", "support@govtjobalert.in\n+91-9999999999"),
    },
    {
      icon: "share-2",
      label: "Share App",
      onPress: handleShare,
    },
    {
      icon: "star",
      label: "Rate App",
      onPress: () =>
        Alert.alert("Rate App", "Thank you for using Govt Job Alert!"),
    },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    headerSub: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: "rgba(255,255,255,0.7)",
    },
    scrollContent: {
      paddingBottom: bottomPad + 100,
    },
    section: {
      marginTop: 16,
      marginHorizontal: 16,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Poppins_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
      paddingHorizontal: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 14,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    menuLabel: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: colors.foreground,
    },
    adminBadge: {
      backgroundColor: colors.secondary + "22",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    adminBadgeText: {
      fontSize: 10,
      fontFamily: "Poppins_700Bold",
      color: colors.secondary,
    },
    logoutItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14,
      marginHorizontal: 16,
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 14,
      borderWidth: 1,
      borderColor: colors.destructive + "44",
    },
    logoutText: {
      fontSize: 14,
      fontFamily: "Poppins_600SemiBold",
      color: colors.destructive,
    },
  });

  const renderItem = (item: MenuItem, index: number, arr: MenuItem[]) => (
    <Pressable
      key={item.label}
      style={({ pressed }) => [
        styles.menuItem,
        index < arr.length - 1 && styles.menuItemBorder,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={item.onPress}
    >
      <View style={[styles.menuIcon, item.color ? { backgroundColor: item.color + "22" } : {}]}>
        <Feather name={item.icon} size={16} color={item.color ?? colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>
      <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
        <Text style={styles.headerSub}>Jobs, info & settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Jobs */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Jobs</Text>
          <View style={styles.sectionCard}>
            {jobMenuItems.map((item, i) => renderItem(item, i, jobMenuItems))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notifications</Text>
          <View style={styles.sectionCard}>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => router.push("/notification-settings")}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + "22" }]}>
                <Feather name="bell" size={16} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Job Alerts</Text>
              <View style={{
                backgroundColor: permissionStatus === "granted" ? "#22C55E22" : colors.secondary + "22",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginRight: 6,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontFamily: "Poppins_700Bold",
                  color: permissionStatus === "granted" ? "#22C55E" : colors.secondary,
                }}>
                  {permissionStatus === "granted" ? "ON" : "OFF"}
                </Text>
              </View>
              <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        {/* Admin */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Admin</Text>
          <View style={styles.sectionCard}>
            {isAdmin ? (
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push("/admin/dashboard")}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.secondary + "22" }]}>
                  <Feather name="layout" size={16} color={colors.secondary} />
                </View>
                <Text style={styles.menuLabel}>Admin Dashboard</Text>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>ADMIN</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push("/admin/login")}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.primary + "22" }]}>
                  <Feather name="lock" size={16} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>Admin Login</Text>
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Information</Text>
          <View style={styles.sectionCard}>
            {infoMenuItems.map((item, i) => renderItem(item, i, infoMenuItems))}
          </View>
        </View>

        {/* Logout if admin */}
        {isAdmin && (
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <Feather name="log-out" size={16} color={colors.destructive} />
            <Text style={styles.logoutText}>Admin Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
