"use client";
import React from 'react';
import type { CourseSchedule } from '@/contexts/scheduleStore';

type Course = {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  credits: number;
};

type DayOption = { value: string; labelEn: string; labelAr: string };

export function SchedulePoster({
  isArabic,
  dir,
  majorName,
  majorNameAr,
  termName,
  totalCredits,
  courses,
  schedules,
  dayOptions,
}: {
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
  majorName: string;
  majorNameAr: string;
  termName?: string;
  totalCredits: number;
  courses: Course[];
  schedules: Record<string, CourseSchedule>;
  dayOptions: readonly DayOption[];
}) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <div
      style={{
        width: 1000,
        height: 1400,
        background: '#0a0a0f',
        color: '#fff',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
      dir={dir}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 0.5, color: '#22c55e' }}>
          {isArabic ? 'الجدول الدراسي' : 'Class Schedule'}
        </div>
        <div style={{ fontSize: 24, color: '#60a5fa', marginTop: 8 }}>
          {isArabic ? majorNameAr : majorName}
        </div>
        {termName ? (
          <div style={{ fontSize: 18, color: '#d1d5db', marginTop: 6 }}>
            {termName}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 18, color: '#a7f3d0' }}>
          {isArabic ? 'إجمالي الساعات:' : 'Total Credits:'} {totalCredits}
        </div>
        <div style={{ fontSize: 16, color: '#9ca3af' }}>{timestamp}</div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px auto 100px 180px 180px 120px',
            background: 'rgba(255,255,255,0.05)',
            padding: '12px 16px',
            fontWeight: 700,
          }}
        >
          <div>{isArabic ? 'الرمز' : 'Code'}</div>
          <div>{isArabic ? 'العنوان' : 'Title'}</div>
          <div>{isArabic ? 'الساعات' : 'Credits'}</div>
          <div>{isArabic ? 'اليوم' : 'Day'}</div>
          <div>{isArabic ? 'الوقت' : 'Time'}</div>
          <div>CRN</div>
        </div>

        {courses.map((course, idx) => {
          const schedule = schedules[course.id];
          const dayLabel = dayOptions.find((d) => d.value === schedule?.day);
          return (
            <div
              key={course.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px auto 100px 180px 180px 120px',
                padding: '12px 16px',
                background: idx % 2 ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
            >
              <div style={{ fontWeight: 700 }}>{course.code}</div>
              <div style={{ color: '#d1d5db' }}>{isArabic ? course.nameAr : course.name}</div>
              <div>{course.credits}</div>
              <div>{isArabic ? dayLabel?.labelAr : dayLabel?.labelEn}</div>
              <div>{schedule ? `${schedule.start} - ${schedule.end}` : '-'}</div>
              <div>{schedule?.crn ?? '-'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
