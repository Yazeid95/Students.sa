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

// Calendar view component
function CalendarScheduleView({
  isArabic,
  courses,
  schedules,
}: Readonly<{
  isArabic: boolean;
  courses: Course[];
  schedules: Record<string, CourseSchedule>;
}>) {
  // Generate time slots from 3:00-3:50 to 9:00-9:50
  const timeSlots = [];
  for (let hour = 3; hour <= 9; hour++) {
    timeSlots.push(`${hour}:00-${hour}:50`);
  }

  // Define days of the week
  const weekDays = [
    { key: 'sunday', labelEn: 'Sunday', labelAr: 'الأحد' },
    { key: 'monday', labelEn: 'Monday', labelAr: 'الاثنين' },
    { key: 'tuesday', labelEn: 'Tuesday', labelAr: 'الثلاثاء' },
    { key: 'wednesday', labelEn: 'Wednesday', labelAr: 'الأربعاء' },
    { key: 'thursday', labelEn: 'Thursday', labelAr: 'الخميس' },
  ];

  // Create a grid to map courses to time slots and days
  const scheduleGrid: Record<string, Record<string, Course[]>> = {};
  
  // Initialize the grid
  timeSlots.forEach(timeSlot => {
    scheduleGrid[timeSlot] = {};
    weekDays.forEach(day => {
      scheduleGrid[timeSlot][day.key] = [];
    });
  });

  // Map courses to the grid
  courses.forEach(course => {
    const schedule = schedules[course.id];
    if (schedule?.start && schedule?.end) {
      const timeSlot = `${schedule.start}-${schedule.end}`;
      
      // Handle day patterns
      if (schedule.day === 'sunday-tuesday') {
        if (scheduleGrid[timeSlot]) {
          scheduleGrid[timeSlot].sunday?.push(course);
          scheduleGrid[timeSlot].tuesday?.push(course);
        }
      } else if (schedule.day === 'monday-wednesday') {
        if (scheduleGrid[timeSlot]) {
          scheduleGrid[timeSlot].monday?.push(course);
          scheduleGrid[timeSlot].wednesday?.push(course);
        }
      }
    }
  });

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header row with days */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px repeat(5, 1fr)',
          background: 'rgba(255,255,255,0.05)',
          padding: '12px 8px',
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        <div style={{ textAlign: 'center', color: '#d4af37' }}>
          {isArabic ? 'الوقت' : 'Time'}
        </div>
        {weekDays.map(day => (
          <div key={day.key} style={{ textAlign: 'center', color: '#d4af37' }}>
            {isArabic ? day.labelAr : day.labelEn}
          </div>
        ))}
      </div>

      {/* Time slots and course data */}
      {timeSlots.map((timeSlot, idx) => (
        <div
          key={timeSlot}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px repeat(5, 1fr)',
            minHeight: 80,
            background: idx % 2 ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}
        >
          {/* Time slot column */}
          <div
            style={{
              padding: '12px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14,
              color: '#9ca3af',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {timeSlot}
          </div>

          {/* Day columns */}
          {weekDays.map(day => {
            const coursesInSlot = scheduleGrid[timeSlot][day.key] || [];
            return (
              <div
                key={day.key}
                style={{
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderRight: day.key !== 'wednesday' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {coursesInSlot.map(course => {
                  const schedule = schedules[course.id];
                  return (
                    <div
                      key={course.id}
                      style={{
                        background: 'linear-gradient(135deg, #d4af37, #f7c843)',
                        color: '#1a1a1a',
                        padding: '8px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        textAlign: 'center',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                        {course.code}
                      </div>
                      <div style={{ fontSize: 10, lineHeight: 1.2, marginBottom: 4 }}>
                        {isArabic ? course.nameAr : course.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#4a4a4a' }}>
                        CRN: {schedule?.crn || '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function SchedulePoster({
  isArabic,
  dir,
  majorName,
  majorNameAr,
  termName,
  totalCredits,
  courses,
  schedules,
}: Readonly<{
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
  majorName: string;
  majorNameAr: string;
  termName?: string;
  totalCredits: number;
  courses: Course[];
  schedules: Record<string, CourseSchedule>;
}>) {
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

      {/* Use the new calendar view instead of the table */}
      <CalendarScheduleView
        isArabic={isArabic}
        courses={courses}
        schedules={schedules}
      />
    </div>
  );
}
