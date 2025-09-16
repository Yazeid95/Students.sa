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
          gridTemplateColumns: '200px repeat(4, 1fr)',
          background: 'rgba(255,255,255,0.05)',
          padding: '20px 16px',
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          {isArabic ? 'الوقت' : 'Time'}
        </div>
        {weekDays.map(day => (
          <div key={day.key} style={{ textAlign: 'center', color: '#ffffff' }}>
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
            gridTemplateColumns: '200px repeat(4, 1fr)',
            height: 140,
            background: idx % 2 ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}
        >
          {/* Time slot column */}
          <div
            style={{
              padding: '20px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 20,
              color: '#ffffff',
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
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  borderRight: day.key !== 'wednesday' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {coursesInSlot.map(course => {
                  const schedule = schedules[course.id];
                  return (
                    <div
                      key={course.id}
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #0891b2)',
                        color: '#ffffff',
                        padding: '8px',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 600,
                        textAlign: 'center',
                        border: '1px solid rgba(8, 145, 178, 0.3)',
                        minHeight: 100,
                        maxHeight: 100,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2, lineHeight: 1 }}>
                        {course.code}
                      </div>
                      <div style={{ 
                        fontSize: 12, 
                        lineHeight: 1.1, 
                        marginBottom: 4,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        wordWrap: 'break-word',
                        overflow: 'hidden'
                      }}>
                        {isArabic ? course.nameAr : course.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#a7f3d0', lineHeight: 1, marginTop: 2 }}>
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
  courses,
  schedules,
}: Readonly<{
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
  courses: Course[];
  schedules: Record<string, CourseSchedule>;
}>) {
  return (
    <div
      style={{
        width: 1000,
        height: 1130,
        background: '#0a0a0f',
        color: '#fff',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
      dir={dir}
    >
      {/* Only the calendar view, no additional information */}
      <CalendarScheduleView
        isArabic={isArabic}
        courses={courses}
        schedules={schedules}
      />
    </div>
  );
}
