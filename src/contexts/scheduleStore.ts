import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Day = 'sunday-tuesday' | 'monday-wednesday';
export type CourseSchedule = {
  day: Day;
  start: string;
  end: string;
  crn: string;
};

type SchedulesMap = Record<string, CourseSchedule>; // key: `${slug}:${courseId}`

interface ScheduleState {
  schedules: SchedulesMap;
  setSchedule: (key: string, data: Partial<CourseSchedule>) => void;
  removeSchedule: (key: string) => void;
  clear: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
  ((set: (partial: Partial<ScheduleState> | ((state: ScheduleState) => Partial<ScheduleState>)) => void) => ({
      schedules: {},
      setSchedule: (key: string, data: Partial<CourseSchedule>) =>
        set((state: ScheduleState) => ({
          schedules: {
            ...state.schedules,
            [key]: { ...(state.schedules[key] || { day: 'sunday-tuesday', start: '3:00', end: '3:50', crn: '' }), ...data },
          },
        })),
      removeSchedule: (key: string) =>
        set((state: ScheduleState) => {
          const next = { ...state.schedules };
          delete next[key];
          return { schedules: next };
        }),
      clear: () => set(() => ({ schedules: {} })),
    })) as StateCreator<ScheduleState>,
    {
      name: 'students-sa-schedules',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
