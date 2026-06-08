import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DatePickerField from "@/components/DatePickerField";
import { type Job, type JobCategory, useJobs } from "@/context/JobsContext";
import { useNotifications } from "@/context/NotificationContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { id: Exclude<JobCategory, "all">; label: string }[] = [
  { id: "central", label: "Central Govt" },
  { id: "state", label: "State Govt" },
  { id: "bank", label: "Bank" },
  { id: "psu", label: "PSU" },
  { id: "railway", label: "Railway" },
  { id: "other", label: "Other" },
];

interface FormData {
  title: string;
  organization: string;
  category: Exclude<JobCategory, "all">;
  qualification: string;
  ageLimit: string;
  vacancies: string;
  location: string;
  startDate: string;
  endDate: string;
  generalFee: string;
  scstFee: string;
  applyLink: string;
  notificationLink: string;
  isPublished: boolean;
}

const INITIAL: FormData = {
  title: "",
  organization: "",
  category: "central",
  qualification: "",
  ageLimit: "",
  vacancies: "",
  location: "",
  startDate: "",
  endDate: "",
  generalFee: "",
  scstFee: "",
  applyLink: "",
  notificationLink: "",
  isPublished: true,
};

function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const colors = useColors();
  const styles = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    label: {
      fontSize: 13,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
      marginBottom: 5,
    },
    req: { color: colors.destructive },
    input: {
      backgroundColor: colors.input,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: colors.foreground,
      minHeight: multiline ? 80 : undefined,
      textAlignVertical: multiline ? "top" : "center",
    },
  });
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.req}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

export default function AddJobScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { jobs, addJob, updateJob } = useJobs();
  const { scheduleJobAlert } = useNotifications();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!id;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (id) {
      const job = jobs.find((j) => j.id === id);
      if (job) {
        setForm({
          title: job.title,
          organization: job.organization,
          category: job.category,
          qualification: job.qualification,
          ageLimit: job.ageLimit,
          vacancies: job.vacancies,
          location: job.location,
          startDate: job.startDate,
          endDate: job.endDate,
          generalFee: job.generalFee,
          scstFee: job.scstFee,
          applyLink: job.applyLink,
          notificationLink: job.notificationLink,
          isPublished: job.isPublished,
        });
      }
    }
  }, [id, jobs]);

  const set = (key: keyof FormData) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.organization.trim()) {
      setError("Post Name and Organization are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit && id) {
        await updateJob(id, form);
      } else {
        await addJob(form as Omit<Job, "id" | "createdAt" | "views">);
        if (form.isPublished) {
          await scheduleJobAlert({
            title: form.title,
            organization: form.organization,
            category: form.category,
            vacancies: form.vacancies,
            endDate: form.endDate,
          });
        }
      }
      router.back();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 8,
      paddingBottom: 14,
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
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: bottomPad + 32,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: "Poppins_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 10,
      marginTop: 8,
    },
    catRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    catChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    catChipText: {
      fontSize: 12,
      fontFamily: "Poppins_600SemiBold",
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleLabel: {
      fontSize: 14,
      fontFamily: "Poppins_600SemiBold",
      color: colors.foreground,
    },
    toggleSub: {
      fontSize: 12,
      fontFamily: "Poppins_400Regular",
      color: colors.mutedForeground,
    },
    errorBox: {
      backgroundColor: colors.destructive + "15",
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
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
    submitBtn: {
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    submitBtnText: {
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
        <Text style={styles.headerTitle}>
          {isEdit ? "Edit Job" : "Add New Job"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Basic Info</Text>
          <FormField label="Job Title" value={form.title} onChange={set("title") as (v: string) => void} required />
          <FormField label="Organization" value={form.organization} onChange={set("organization") as (v: string) => void} required />

          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((cat) => {
              const active = form.category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: active ? colors.primary : colors.muted,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => set("category")(cat.id)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: active ? "#FFFFFF" : colors.mutedForeground },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Eligibility</Text>
          <FormField label="Qualification" value={form.qualification} onChange={set("qualification") as (v: string) => void} />
          <FormField label="Age Limit" value={form.ageLimit} onChange={set("ageLimit") as (v: string) => void} placeholder="e.g. 18-30 Years" />
          <FormField label="Vacancies" value={form.vacancies} onChange={set("vacancies") as (v: string) => void} placeholder="e.g. 500" />
          <FormField label="Location" value={form.location} onChange={set("location") as (v: string) => void} placeholder="e.g. All India" />

          <Text style={styles.sectionLabel}>Important Dates</Text>
          <DatePickerField label="Start Date" value={form.startDate} onChange={set("startDate") as (v: string) => void} />
          <DatePickerField label="Last Date" value={form.endDate} onChange={set("endDate") as (v: string) => void} required />

          <Text style={styles.sectionLabel}>Application Fee</Text>
          <FormField label="General Fee" value={form.generalFee} onChange={set("generalFee") as (v: string) => void} placeholder="e.g. ₹500" />
          <FormField label="SC/ST Fee" value={form.scstFee} onChange={set("scstFee") as (v: string) => void} placeholder="e.g. Nil or ₹250" />

          <Text style={styles.sectionLabel}>Links</Text>
          <FormField label="Apply Online Link" value={form.applyLink} onChange={set("applyLink") as (v: string) => void} placeholder="https://..." />
          <FormField label="Notification PDF Link" value={form.notificationLink} onChange={set("notificationLink") as (v: string) => void} placeholder="https://..." />

          {/* Publish Toggle */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Publish Job</Text>
              <Text style={styles.toggleSub}>
                {form.isPublished ? "Visible to users" : "Hidden from users"}
              </Text>
            </View>
            <Switch
              value={form.isPublished}
              onValueChange={(v) => set("isPublished")(v)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {error.length > 0 && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: isEdit ? colors.secondary : colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather
                  name={isEdit ? "check" : "plus-circle"}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.submitBtnText}>
                  {isEdit ? "Update Job" : "Publish Job"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
