"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Hash, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Course {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  credits: number;
  prerequisites: string[];
  isCompleted?: boolean;
  semester?: number;
  type: 'core' | 'elective' | 'general';
  hourRequirement?: number;
}

interface ScheduleEntry {
  courseId: string;
  day: 'sunday-tuesday' | 'monday-wednesday';
  timeSlot: string;
  crn: string;
}

interface ScheduleCreatorProps {
  courses: Course[];
  onScheduleUpdate: (schedule: ScheduleEntry[]) => void;
}

// Generate time slots from 3:00-3:50 to 9:00-9:50
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 3; hour <= 9; hour++) {
    const startTime = `${hour}:00`;
    const endTime = `${hour}:50`;
    slots.push(`${startTime}-${endTime}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Course Item Component
function CourseItem({ course, isScheduled, onAdd }: { 
  course: Course; 
  isScheduled: boolean; 
  onAdd: (course: Course) => void;
}) {
  const { isArabic } = useLanguage();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        isScheduled 
          ? 'bg-green-500/10 border-green-500/30 opacity-50' 
          : 'bg-white/5 border-white/10 hover:border-blue-500/50'
      }`}
      onClick={() => !isScheduled && onAdd(course)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{course.code}</div>
          <div className="text-gray-300 text-xs">
            {isArabic ? course.nameAr : course.name}
          </div>
          <div className="text-cyan-400 text-xs mt-1">
            {course.credits} {isArabic ? "ساعة" : "credits"}
          </div>
        </div>
        {isScheduled && (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
      </div>
    </motion.div>
  );
}

// Schedule Entry Component
function ScheduleEntryComponent({ 
  entry, 
  course, 
  onUpdate, 
  onRemove, 
  hasConflict 
}: {
  entry: ScheduleEntry;
  course: Course;
  onUpdate: (field: keyof ScheduleEntry, value: string) => void;
  onRemove: () => void;
  hasConflict: boolean;
}) {
  const { isArabic } = useLanguage();
  
  const dayOptions = [
    { value: 'sunday-tuesday', labelEn: 'Sunday & Tuesday', labelAr: 'الأحد والثلاثاء' },
    { value: 'monday-wednesday', labelEn: 'Monday & Wednesday', labelAr: 'الاثنين والأربعاء' }
  ] as const;

  const validateCRN = (crn: string): boolean => {
    return /^\d{5}$/.test(crn);
  };

  const crnValid = validateCRN(entry.crn);
  
  const getCrnInputClasses = () => {
    if (entry.crn && !crnValid) return 'border-red-500 focus:border-red-500';
    if (entry.crn && crnValid) return 'border-green-500 focus:border-green-500';
    return 'border-white/20 focus:border-blue-500';
  };

  const getTimeSelectClasses = () => {
    return hasConflict 
      ? 'border-red-500 focus:border-red-500' 
      : 'border-white/20 focus:border-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-semibold text-white">{course.code}</div>
            <div className="text-gray-300 text-sm">
              {isArabic ? course.nameAr : course.name}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onRemove}
            className="text-red-400 border-red-400/30 hover:bg-red-400/20"
          >
            {isArabic ? "إزالة" : "Remove"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {isArabic ? "اختر اليوم" : "Choose Day"}
          </label>
          <select
            value={entry.day}
            onChange={(e) => onUpdate('day', e.target.value)}
            className="w-full p-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            {dayOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {isArabic ? option.labelAr : option.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {isArabic ? "اختر الوقت" : "Choose Time"}
          </label>
          <select
            value={entry.timeSlot}
            onChange={(e) => onUpdate('timeSlot', e.target.value)}
            className={`w-full p-2 bg-black/30 border rounded-lg text-white text-sm focus:outline-none ${getTimeSelectClasses()}`}
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot} className="bg-black text-white">
                {slot}
              </option>
            ))}
          </select>
          {hasConflict && (
            <div className="text-red-400 text-xs mt-1">
              {isArabic ? "تعارض في الوقت" : "Time conflict"}
            </div>
          )}
        </div>

        {/* CRN Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {isArabic ? "رقم CRN" : "CRN Number"}
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={entry.crn}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                onUpdate('crn', value);
              }}
              placeholder="12345"
              maxLength={5}
              className={`w-full p-2 pl-10 bg-black/30 border rounded-lg text-white text-sm focus:outline-none ${getCrnInputClasses()}`}
            />
            {entry.crn && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {crnValid ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
              </div>
            )}
          </div>
          {entry.crn && !crnValid && (
            <div className="text-red-400 text-xs mt-1">
              {isArabic ? "يجب أن يكون 5 أرقام" : "Must be 5 digits"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ScheduleCreator({ courses, onScheduleUpdate }: ScheduleCreatorProps) {
  const { isArabic } = useLanguage();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [showScheduleBuilder, setShowScheduleBuilder] = useState(false);

  const addCourseToSchedule = (course: Course) => {
    const newEntry: ScheduleEntry = {
      courseId: course.id,
      day: 'sunday-tuesday',
      timeSlot: timeSlots[0],
      crn: ''
    };
    setSchedule([...schedule, newEntry]);
  };

  const updateScheduleEntry = (courseId: string, field: keyof ScheduleEntry, value: string) => {
    const updatedSchedule = schedule.map(entry => 
      entry.courseId === courseId 
        ? { ...entry, [field]: value }
        : entry
    );
    setSchedule(updatedSchedule);
    onScheduleUpdate(updatedSchedule);
  };

  const removeFromSchedule = (courseId: string) => {
    const updatedSchedule = schedule.filter(entry => entry.courseId !== courseId);
    setSchedule(updatedSchedule);
    onScheduleUpdate(updatedSchedule);
  };

  const validateCRN = (crn: string): boolean => {
    return /^\d{5}$/.test(crn);
  };

  const isScheduleValid = (): boolean => {
    return schedule.every(entry => validateCRN(entry.crn));
  };

  const hasTimeConflict = (day: string, timeSlot: string, excludeCourseId?: string): boolean => {
    return schedule.some(entry => 
      entry.courseId !== excludeCourseId &&
      entry.day === day && 
      entry.timeSlot === timeSlot
    );
  };

  const getCourseByCourseId = (courseId: string): Course | undefined => {
    return courses.find(c => c.id === courseId);
  };

  const getStatusText = () => {
    const valid = isScheduleValid();
    if (valid) {
      return isArabic ? "جاهز" : "Ready";
    }
    return isArabic ? "غير مكتمل" : "Incomplete";
  };

  const getStatusClasses = () => {
    const valid = isScheduleValid();
    return valid 
      ? 'bg-green-500/20 text-green-400' 
      : 'bg-orange-500/20 text-orange-400';
  };

  if (!showScheduleBuilder) {
    return (
      <div className="text-center py-6">
        <Button 
          onClick={() => setShowScheduleBuilder(true)}
          className="bg-gradient-primary hover:bg-gradient-primary/80"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {isArabic ? "إنشاء جدول المقررات" : "Create Schedule"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            {isArabic ? "اختر المقررات للجدولة" : "Select Courses for Scheduling"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map(course => (
              <CourseItem
                key={course.id}
                course={course}
                isScheduled={schedule.some(entry => entry.courseId === course.id)}
                onAdd={addCourseToSchedule}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Builder */}
      {schedule.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              {isArabic ? "جدولة المقررات" : "Course Scheduling"}
              {!isScheduleValid() && (
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map(entry => {
                const course = getCourseByCourseId(entry.courseId);
                if (!course) return null;

                const hasConflict = hasTimeConflict(entry.day, entry.timeSlot, entry.courseId);

                return (
                  <ScheduleEntryComponent
                    key={entry.courseId}
                    entry={entry}
                    course={course}
                    onUpdate={(field, value) => updateScheduleEntry(entry.courseId, field, value)}
                    onRemove={() => removeFromSchedule(entry.courseId)}
                    hasConflict={hasConflict}
                  />
                );
              })}
            </div>

            {/* Schedule Summary */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">
                  {isArabic ? "ملخص الجدول" : "Schedule Summary"}
                </h4>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">
                    {isArabic ? "إجمالي المقررات:" : "Total Courses:"}
                  </span>
                  <span className="text-white ml-2">{schedule.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">
                    {isArabic ? "إجمالي الساعات:" : "Total Credits:"}
                  </span>
                  <span className="text-white ml-2">
                    {schedule.reduce((total, entry) => {
                      const course = getCourseByCourseId(entry.courseId);
                      return total + (course?.credits || 0);
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => setShowScheduleBuilder(false)}
        >
          {isArabic ? "إخفاء منشئ الجدول" : "Hide Schedule Builder"}
        </Button>
        {schedule.length > 0 && (
          <Button
            onClick={() => {
              setSchedule([]);
              onScheduleUpdate([]);
            }}
            variant="outline"
            className="text-red-400 border-red-400/30 hover:bg-red-400/20"
          >
            {isArabic ? "مسح الجدول" : "Clear Schedule"}
          </Button>
        )}
      </div>
    </div>
  );
}