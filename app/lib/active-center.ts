import { cookies } from "next/headers";
import { getCenterExperience } from "@/app/lib/center-experience";

const ACTIVE_CENTER_COOKIE = "hive_active_center";

export async function getActiveCenterNumber() {
  const cookieStore = await cookies();

  return (
    cookieStore.get(ACTIVE_CENTER_COOKIE)?.value ??
    "115"
  );
}

export async function getActiveCenter() {
  const centerNumber = await getActiveCenterNumber();

  return getCenterExperience(centerNumber);
}