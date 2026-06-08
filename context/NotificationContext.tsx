import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

import { type JobCategory } from "@/context/JobsContext";

const PREFS_KEY = "@govtjobalert/notif_prefs";
const PERMISSION_ASKED_KEY = "@govtjobalert/notif_asked";

export type CategoryPrefs = Record<Exclude<JobCategory, "all">, boolean>;

const DEFAULT_PREFS: CategoryPrefs = {
  central: true,
  state: true,
  bank: true,
  psu: true,
  railway: true,
  other: true,
};

interface NotificationContextValue {
  permissionStatus: "granted" | "denied" | "undetermined" | "unavailable";
  categoryPrefs: CategoryPrefs;
  requestPermission: () => Promise<boolean>;
  toggleCategory: (cat: Exclude<JobCategory, "all">) => Promise<void>;
  scheduleJobAlert: (params: {
    title: string;
    organization: string;
    category: Exclude<JobCategory, "all">;
    vacancies: string;
    endDate: string;
  }) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const isNative = Platform.OS !== "web";

if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationContextValue["permissionStatus"]>(
      isNative ? "undetermined" : "unavailable"
    );
  const [categoryPrefs, setCategoryPrefs] =
    useState<CategoryPrefs>(DEFAULT_PREFS);
  const notifListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(PREFS_KEY);
      if (raw) {
        try {
          setCategoryPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
        } catch {}
      }

      if (!isNative) return;

      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status as NotificationContextValue["permissionStatus"]);

      const asked = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
      if (!asked && status === "undetermined") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(newStatus as NotificationContextValue["permissionStatus"]);
        await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
      }
    })();

    if (isNative) {
      notifListener.current = Notifications.addNotificationReceivedListener(() => {});
    }
    return () => {
      if (notifListener.current)
        Notifications.removeNotificationSubscription(notifListener.current);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isNative) return false;
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status as NotificationContextValue["permissionStatus"]);
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
    return status === "granted";
  }, []);

  const toggleCategory = useCallback(
    async (cat: Exclude<JobCategory, "all">) => {
      const updated = { ...categoryPrefs, [cat]: !categoryPrefs[cat] };
      setCategoryPrefs(updated);
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    },
    [categoryPrefs]
  );

  const scheduleJobAlert = useCallback(
    async ({
      title,
      organization,
      category,
      vacancies,
      endDate,
    }: {
      title: string;
      organization: string;
      category: Exclude<JobCategory, "all">;
      vacancies: string;
      endDate: string;
    }) => {
      if (!isNative || permissionStatus !== "granted" || !categoryPrefs[category])
        return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏛️ New Govt Job: ${title}`,
          body: `${organization} • ${vacancies} Posts\nLast Date: ${endDate}`,
          data: { category },
          sound: true,
        },
        trigger: {
          seconds: 2,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    },
    [permissionStatus, categoryPrefs]
  );

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        categoryPrefs,
        requestPermission,
        toggleCategory,
        scheduleJobAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
