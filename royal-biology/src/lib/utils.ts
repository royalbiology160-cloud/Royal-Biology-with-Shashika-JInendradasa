import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLKR(amount: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateStudentId(seq: number) {
  return `RB2027-${String(seq).padStart(4, "0")}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "සුබ උදෑසනක්";
  if (hour < 17) return "සුබ දහවලක්";
  return "සුබ සන්ධ්‍යාවක්";
}
