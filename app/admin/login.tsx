import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAdmin } from "@/context/AdminContext";
import { useColors } from "@/hooks/useColors";

export default function AdminLoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");
    const success = await login(username.trim(), password.trim());
    setLoading(false);
    if (success) {
      router.replace("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 8,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: { padding: 4 },
    headerTitle: {
      fontSize: 17,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: bottomPad,
    },
    hero: {
      alignItems: "center",
      paddingTop: 48,
      paddingBottom: 40,
    },
    iconBg: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    inputLabel: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
      marginBottom: 6,
      marginTop: 16,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
    },
    input: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.foreground,
      padding: 0,
    },
    errorBox: {
      backgroundColor: colors.destructive + "15",
      borderRadius: 8,
      padding: 10,
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    errorText: {
      fontSize: 12,
      fontFamily: "Poppins_500Medium",
      color: colors.destructive,
      flex: 1,
    },
    loginBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 28,
    },
    loginBtnText: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Login</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.iconBg}>
              <Feather name="shield" size={36} color={colors.primary} />
            </View>
            <Text style={styles.title}>Admin Portal</Text>
            <Text style={styles.subtitle}>
              Restricted access. Enter your credentials to continue.
            </Text>
          </View>

          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={16} color={colors.mutedForeground} />
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor={colors.mutedForeground}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputRow}>
            <Feather name="lock" size={16} color={colors.mutedForeground} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather
                name={showPass ? "eye-off" : "eye"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          {error.length > 0 && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginBtn, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
