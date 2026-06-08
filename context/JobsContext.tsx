import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type JobCategory =
  | "all"
  | "central"
  | "state"
  | "bank"
  | "psu"
  | "railway"
  | "other";

export interface Job {
  id: string;
  title: string;
  organization: string;
  category: Exclude<JobCategory, "all">;
  qualification: string;
  ageLimit: string;
  vacancies: string;
  location: string;
  notificationDate: string;
  startDate: string;
  endDate: string;
  generalFee: string;
  scstFee: string;
  applyLink: string;
  notificationLink: string;
  isPublished: boolean;
  createdAt: number;
  views: number;
}

const SEED_JOBS: Job[] = [
  {
    id: "1",
    title: "Civil Services Examination",
    organization: "Union Public Service Commission (UPSC)",
    category: "central",
    qualification: "Bachelor's Degree in any discipline",
    ageLimit: "21-32 Years",
    vacancies: "1105",
    location: "All India",
    notificationDate: "14 Feb 2026",
    startDate: "05 Mar 2026",
    endDate: "25 Mar 2026",
    generalFee: "₹100",
    scstFee: "Nil",
    applyLink: "https://upsc.gov.in",
    notificationLink: "https://upsc.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 1,
    views: 4823,
  },
  {
    id: "2",
    title: "Staff Selection Commission CGL",
    organization: "Staff Selection Commission (SSC)",
    category: "central",
    qualification: "Bachelor's Degree",
    ageLimit: "18-32 Years",
    vacancies: "17727",
    location: "All India",
    notificationDate: "22 Jan 2026",
    startDate: "10 Feb 2026",
    endDate: "15 Mar 2026",
    generalFee: "₹100",
    scstFee: "Nil",
    applyLink: "https://ssc.nic.in",
    notificationLink: "https://ssc.nic.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 2,
    views: 6210,
  },
  {
    id: "3",
    title: "SBI Clerk (Junior Associate)",
    organization: "State Bank of India (SBI)",
    category: "bank",
    qualification: "Graduation in any discipline",
    ageLimit: "20-28 Years",
    vacancies: "13735",
    location: "All India",
    notificationDate: "05 Jan 2026",
    startDate: "17 Jan 2026",
    endDate: "07 Feb 2026",
    generalFee: "₹750",
    scstFee: "₹0",
    applyLink: "https://bank.sbi",
    notificationLink: "https://bank.sbi",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 3,
    views: 8934,
  },
  {
    id: "4",
    title: "IBPS Probationary Officer (PO)",
    organization: "Institute of Banking Personnel Selection (IBPS)",
    category: "bank",
    qualification: "Graduation in any stream",
    ageLimit: "20-30 Years",
    vacancies: "4455",
    location: "All India",
    notificationDate: "01 Feb 2026",
    startDate: "12 Feb 2026",
    endDate: "28 Feb 2026",
    generalFee: "₹850",
    scstFee: "₹175",
    applyLink: "https://ibps.in",
    notificationLink: "https://ibps.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 4,
    views: 5612,
  },
  {
    id: "5",
    title: "RRB NTPC Graduate Level Posts",
    organization: "Railway Recruitment Board (RRB)",
    category: "railway",
    qualification: "Bachelor's Degree / Diploma",
    ageLimit: "18-33 Years",
    vacancies: "11558",
    location: "All India",
    notificationDate: "20 Jan 2026",
    startDate: "25 Jan 2026",
    endDate: "10 Mar 2026",
    generalFee: "₹500",
    scstFee: "₹250",
    applyLink: "https://indianrailways.gov.in",
    notificationLink: "https://indianrailways.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 5,
    views: 12045,
  },
  {
    id: "6",
    title: "Railway Group D (Level 1 Posts)",
    organization: "Railway Recruitment Cell (RRC)",
    category: "railway",
    qualification: "10th Pass / ITI",
    ageLimit: "18-40 Years",
    vacancies: "32438",
    location: "All India",
    notificationDate: "10 Feb 2026",
    startDate: "20 Feb 2026",
    endDate: "20 Mar 2026",
    generalFee: "₹500",
    scstFee: "₹250",
    applyLink: "https://rrcb.gov.in",
    notificationLink: "https://rrcb.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 6,
    views: 18732,
  },
  {
    id: "7",
    title: "ONGC Graduate Trainee",
    organization: "Oil and Natural Gas Corporation (ONGC)",
    category: "psu",
    qualification: "B.E./B.Tech in relevant discipline",
    ageLimit: "25-30 Years",
    vacancies: "2763",
    location: "Pan India",
    notificationDate: "08 Jan 2026",
    startDate: "15 Jan 2026",
    endDate: "15 Feb 2026",
    generalFee: "₹300",
    scstFee: "Nil",
    applyLink: "https://ongcindia.com",
    notificationLink: "https://ongcindia.com",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 7,
    views: 3421,
  },
  {
    id: "8",
    title: "NTPC Executive Trainee",
    organization: "National Thermal Power Corporation (NTPC)",
    category: "psu",
    qualification: "B.E./B.Tech with minimum 65% marks",
    ageLimit: "18-27 Years",
    vacancies: "130",
    location: "Pan India",
    notificationDate: "12 Feb 2026",
    startDate: "18 Feb 2026",
    endDate: "10 Mar 2026",
    generalFee: "₹300",
    scstFee: "Nil",
    applyLink: "https://ntpc.co.in",
    notificationLink: "https://ntpc.co.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 8,
    views: 2156,
  },
  {
    id: "9",
    title: "UP Police Constable",
    organization: "Uttar Pradesh Police Recruitment Board",
    category: "state",
    qualification: "12th Pass (Intermediate)",
    ageLimit: "18-25 Years",
    vacancies: "60244",
    location: "Uttar Pradesh",
    notificationDate: "17 Dec 2025",
    startDate: "27 Dec 2025",
    endDate: "16 Jan 2026",
    generalFee: "₹400",
    scstFee: "₹400",
    applyLink: "https://uppbpb.gov.in",
    notificationLink: "https://uppbpb.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 9,
    views: 22891,
  },
  {
    id: "10",
    title: "Maharashtra PSC Group B Officer",
    organization: "Maharashtra Public Service Commission (MPSC)",
    category: "state",
    qualification: "Bachelor's Degree in relevant subject",
    ageLimit: "21-38 Years",
    vacancies: "2120",
    location: "Maharashtra",
    notificationDate: "25 Jan 2026",
    startDate: "05 Feb 2026",
    endDate: "25 Feb 2026",
    generalFee: "₹524",
    scstFee: "₹324",
    applyLink: "https://mpsc.gov.in",
    notificationLink: "https://mpsc.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 10,
    views: 4567,
  },
  {
    id: "11",
    title: "DRDO Scientist B Recruitment",
    organization: "Defence Research & Development Organisation",
    category: "central",
    qualification: "M.Sc./M.E./M.Tech. in relevant discipline",
    ageLimit: "18-28 Years",
    vacancies: "167",
    location: "Delhi / Pan India",
    notificationDate: "30 Jan 2026",
    startDate: "10 Feb 2026",
    endDate: "02 Mar 2026",
    generalFee: "₹100",
    scstFee: "Nil",
    applyLink: "https://drdo.gov.in",
    notificationLink: "https://drdo.gov.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 11,
    views: 2788,
  },
  {
    id: "12",
    title: "Punjab National Bank Credit Officer",
    organization: "Punjab National Bank (PNB)",
    category: "bank",
    qualification: "B.E./B.Tech/MBA or relevant PG degree",
    ageLimit: "25-35 Years",
    vacancies: "1025",
    location: "All India",
    notificationDate: "03 Feb 2026",
    startDate: "12 Feb 2026",
    endDate: "28 Feb 2026",
    generalFee: "₹850",
    scstFee: "₹175",
    applyLink: "https://pnbindia.in",
    notificationLink: "https://pnbindia.in",
    isPublished: true,
    createdAt: Date.now() - 86400000 * 12,
    views: 1923,
  },
];

const JOBS_KEY = "@govtjobalert/jobs";
const SAVED_KEY = "@govtjobalert/saved";

interface JobsContextValue {
  jobs: Job[];
  savedIds: string[];
  loading: boolean;
  addJob: (job: Omit<Job, "id" | "createdAt" | "views">) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  toggleSave: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [rawJobs, rawSaved] = await Promise.all([
          AsyncStorage.getItem(JOBS_KEY),
          AsyncStorage.getItem(SAVED_KEY),
        ]);
        if (rawJobs) {
          setJobs(JSON.parse(rawJobs));
        } else {
          await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(SEED_JOBS));
          setJobs(SEED_JOBS);
        }
        if (rawSaved) {
          setSavedIds(JSON.parse(rawSaved));
        }
      } catch {
        setJobs(SEED_JOBS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: Job[]) => {
    setJobs(updated);
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(updated));
  }, []);

  const addJob = useCallback(
    async (job: Omit<Job, "id" | "createdAt" | "views">) => {
      const newJob: Job = {
        ...job,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        createdAt: Date.now(),
        views: 0,
      };
      await persist([newJob, ...jobs]);
    },
    [jobs, persist]
  );

  const updateJob = useCallback(
    async (id: string, updates: Partial<Job>) => {
      await persist(jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    },
    [jobs, persist]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      await persist(jobs.filter((j) => j.id !== id));
    },
    [jobs, persist]
  );

  const toggleSave = useCallback(
    async (id: string) => {
      const updated = savedIds.includes(id)
        ? savedIds.filter((s) => s !== id)
        : [...savedIds, id];
      setSavedIds(updated);
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    },
    [savedIds]
  );

  const incrementViews = useCallback(
    async (id: string) => {
      await persist(
        jobs.map((j) => (j.id === id ? { ...j, views: j.views + 1 } : j))
      );
    },
    [jobs, persist]
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        savedIds,
        loading,
        addJob,
        updateJob,
        deleteJob,
        toggleSave,
        incrementViews,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within JobsProvider");
  return ctx;
}
