import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function formatDate(date: Date): string {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const d = String(date.getDate()).padStart(2, "0");
  return `${d} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseDate(str: string): Date {
  if (str) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default function DatePickerField({ label, value, onChange, required }: Props) {
  const colors = useColors();
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(parseDate(value));

  const styles = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    label: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
      marginBottom: 5,
    },
    req: { color: colors.destructive },
    fieldBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
    },
    fieldBtnActive: { borderColor: colors.primary },
    fieldText: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: colors.foreground,
    },
    fieldPlaceholder: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    webInput: {
      backgroundColor: colors.input,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.foreground,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 32,
    },
    sheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sheetTitle: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
      color: colors.foreground,
    },
    cancelText: {
      fontSize: 14,
      fontFamily: "Poppins_500Medium",
      color: colors.mutedForeground,
    },
    doneText: {
      fontSize: 14,
      fontFamily: "Poppins_700Bold",
      color: colors.primary,
    },
  });

  // Web: plain text input (datetimepicker not supported)
  if (Platform.OS === "web") {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.req}> *</Text>}
        </Text>
        <View style={[styles.fieldBtn]}>
          <Feather name="calendar" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.fieldText, { padding: 0 }]}
            value={value}
            onChangeText={onChange}
            placeholder={`e.g. 15 Jan 2026`}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
          />
        </View>
      </View>
    );
  }

  // Android: show inline picker directly
  const handleAndroidChange = (_: unknown, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) onChange(formatDate(selectedDate));
  };

  // iOS: show bottom sheet modal with spinner
  const handleIOSChange = (_: unknown, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.req}> *</Text>}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.fieldBtn,
          show && styles.fieldBtnActive,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => {
          setTempDate(parseDate(value));
          setShow(true);
        }}
      >
        <Feather name="calendar" size={15} color={value ? colors.primary : colors.mutedForeground} />
        {value ? (
          <Text style={styles.fieldText}>{value}</Text>
        ) : (
          <Text style={styles.fieldPlaceholder}>Select {label}</Text>
        )}
        <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
      </Pressable>

      {/* Android: inline picker */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
          minimumDate={new Date(2020, 0, 1)}
          maximumDate={new Date(2032, 11, 31)}
        />
      )}

      {/* iOS: bottom sheet modal */}
      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setShow(false)}>
            <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.sheetTitle}>{label}</Text>
                <TouchableOpacity
                  onPress={() => {
                    onChange(formatDate(tempDate));
                    setShow(false);
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleIOSChange}
                minimumDate={new Date(2020, 0, 1)}
                maximumDate={new Date(2032, 11, 31)}
                style={{ height: 200 }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
