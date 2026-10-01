"use client";

import { useEffect, useState } from "react";

interface GymClock {
  /** Current hour 0 to 23 in the gym's timezone */
  hour: number;
  minute: number;
  /** English weekday name in the gym's timezone, e.g. "Monday" */
  weekday: string;
  date: Date;
}

function read(timeZone: string): GymClock {
  const date = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { hour: Number(get("hour")) % 24, minute: Number(get("minute")), weekday: get("weekday"), date };
}

/** The gym's local clock; null until mounted so server and client markup match */
export function useGymClock(timeZone: string) {
  const [clock, setClock] = useState<GymClock | null>(null);
  useEffect(() => {
    setClock(read(timeZone));
    const timer = window.setInterval(() => setClock(read(timeZone)), 30_000);
    return () => window.clearInterval(timer);
  }, [timeZone]);
  return clock;
}

/** Whether "HH:MM" opening hours include the given time */
export function isOpenAt(hours: { open: string; close: string; is24Hours: boolean }, hour: number, minute = 0) {
  if (hours.is24Hours) return true;
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const now = hour * 60 + minute;
  const open = toMin(hours.open);
  let close = toMin(hours.close);
  if (close <= open) close += 24 * 60;
  return (now >= open && now < close) || (now + 24 * 60 >= open && now + 24 * 60 < close);
}
