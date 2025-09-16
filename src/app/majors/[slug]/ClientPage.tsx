"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  GraduationCap,
  Plus,
  Trash2,
  Download,
  Hash,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScheduleStore } from "@/contexts/scheduleStore";
import type { CourseSchedule, Day } from "@/contexts/scheduleStore";
import { SchedulePoster } from "@/components/SchedulePoster";

// Helper function for Arabic pluralization
const getArabicHoursPlural = (count: number): string => {
  if (count === 1) return "ساعة";
  if (count === 2) return "ساعتان";
  if (count >= 3 && count <= 10) return "ساعات";
  return "ساعة"; // for 11+ or 0, Arabic uses singular form
};

// Helper function for Arabic course pluralization
const getArabicCoursesPlural = (count: number): string => {
  if (count === 1) return "مقرر";
  if (count === 2) return "مقرران";
  if (count >= 3 && count <= 10) return "مقررات";
  return "مقرر"; // for 11+ or 0, Arabic uses singular form
};
// Time helpers
const startTimes = ["3:00","4:00","5:00","6:00","7:00","8:00","9:00"] as const;
const endTimeForStart = (start: string) => `${start.split(":")[0]}:50`;

// Validate CRN (4-5 digits)
const validateCRNInput = (crn: string | undefined | null): boolean => {
  if (!crn) return false;
  return /^\d{4,5}$/.test(crn);
};

// Get border classes for CRN input based on validity
const getCrnBorderClass = (crn: string | undefined | null): string => {
  if (!crn || crn.length === 0) return 'border-white/20 focus:border-blue-500';
  return validateCRNInput(crn)
    ? 'border-green-500 focus:border-green-500'
    : 'border-red-500 focus:border-red-500';
};

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
  hourRequirement?: number; // For courses that require minimum completed hours
}

interface ScheduleEntry {
  courseId: string;
  day: 'sunday-tuesday' | 'monday-wednesday';
  start: string;
  end: string;
  crn: string;
}

// Maintain for backward-compatibility if needed (removed unused generator)

const dayOptions = [
  { value: 'sunday-tuesday', labelEn: 'Sunday & Tuesday', labelAr: 'الأحد والثلاثاء' },
  { value: 'monday-wednesday', labelEn: 'Monday & Wednesday', labelAr: 'الاثنين والأربعاء' }
] as const;

interface MajorData {
  id: string;
  name: string;
  nameAr: string;
  totalCredits: number;
  courses: Course[];
  sharedFirstYearCourses: Course[];
  universityRequirements: Course[]; // Added for first year courses
}

// Information Technology Major Data
const itMajorData: MajorData = {
  id: "information-technology",
  name: "Information Technology",
  nameAr: "تقنية المعلومات",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses)
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements (10 courses)
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" },
    { id: "sci101", code: "SCI101", name: "General Physics 1", nameAr: "الفيزياء العامة 1", credits: 3, prerequisites: [], type: "core" },
    { id: "sci201", code: "SCI201", name: "General Physics 2", nameAr: "الفيزياء العامة 2", credits: 3, prerequisites: ["sci101"], type: "core" },
    { id: "math150", code: "MATH150", name: "Discrete Mathematics", nameAr: "الرياضيات المتقطعة", credits: 3, prerequisites: [], type: "core" },
    { id: "math251", code: "MATH251", name: "Linear Algebra", nameAr: "الجبر الخطي", credits: 3, prerequisites: ["math150"], type: "core" },
    { id: "eng103", code: "ENG103", name: "Technical Writing", nameAr: "الكتابة التقنية", credits: 3, prerequisites: [], type: "core" },
    { id: "stat101", code: "STAT101", name: "Statistics", nameAr: "الإحصاء", credits: 3, prerequisites: [], type: "core" }
  ],
  courses: [
    // Major Core Courses - 3rd Semester
    { id: "it231", code: "IT231", name: "Introduction to IT and IS", nameAr: "مقدمة في تقنية المعلومات ونظم المعلومات", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "it232", code: "IT232", name: "Object Oriented Programming", nameAr: "البرمجة الكائنية التوجه", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "it233", code: "IT233", name: "Computer Organization", nameAr: "تنظيم الحاسوب", credits: 3, prerequisites: [], type: "core", semester: 3 },
    // 4th Semester
    { id: "it241", code: "IT241", name: "Operating Systems", nameAr: "أنظمة التشغيل", credits: 3, prerequisites: ["it233"], type: "core", semester: 4 },
    { id: "it244", code: "IT244", name: "Introduction to Database", nameAr: "مقدمة في قواعد البيانات", credits: 3, prerequisites: ["it232"], type: "core", semester: 4 },
    { id: "it245", code: "IT245", name: "Data Structure", nameAr: "هياكل البيانات", credits: 3, prerequisites: ["it232"], type: "core", semester: 4 },
    // 5th Semester
    { id: "it351", code: "IT351", name: "Computer Networks", nameAr: "شبكات الحاسوب", credits: 3, prerequisites: ["it241"], type: "core", semester: 5 },
    { id: "it352", code: "IT352", name: "Human Computer Interaction", nameAr: "التفاعل بين الإنسان والحاسوب", credits: 3, prerequisites: ["it231", "it245"], type: "core", semester: 5 },
    { id: "it353", code: "IT353", name: "System Analysis and Design", nameAr: "تحليل وتصميم النظم", credits: 3, prerequisites: ["it245"], type: "core", semester: 5 },
    { id: "it354", code: "IT354", name: "Database Management Systems", nameAr: "أنظمة إدارة قواعد البيانات", credits: 3, prerequisites: ["it244"], type: "core", semester: 5 },
    // 6th Semester
    { id: "it361", code: "IT361", name: "Web Technologies", nameAr: "تقنيات الويب", credits: 3, prerequisites: ["it352", "it244"], type: "core", semester: 6 },
    { id: "it362", code: "IT362", name: "IT Project Management", nameAr: "إدارة مشاريع تقنية المعلومات", credits: 3, prerequisites: ["it353"], type: "core", semester: 6 },
    { id: "it363", code: "IT363", name: "Network Management", nameAr: "إدارة الشبكات", credits: 3, prerequisites: ["it351"], type: "core", semester: 6 },
    { id: "it364", code: "IT364", name: "IT Entrepreneurship and Innovation", nameAr: "ريادة الأعمال والابتكار في تقنية المعلومات", credits: 3, prerequisites: ["it244"], type: "core", semester: 6 },
    { id: "it365", code: "IT365", name: "Enterprise Systems", nameAr: "أنظمة المؤسسات", credits: 3, prerequisites: ["it352"], type: "core", semester: 6 },
    // 7th Semester
    { id: "it474", code: "IT474", name: "Introduction to Cyber Security and Digital Crime", nameAr: "مقدمة في الأمن السيبراني والجرائم الرقمية", credits: 3, prerequisites: ["it363"], type: "core", semester: 7 },
    { id: "it475", code: "IT475", name: "Decision Support Systems", nameAr: "أنظمة دعم القرار", credits: 3, prerequisites: ["it354"], type: "core", semester: 7 },
    { id: "it476", code: "IT476", name: "IT Security & Policies", nameAr: "أمن تقنية المعلومات والسياسات", credits: 3, prerequisites: ["it351"], type: "core", semester: 7 },
    { id: "it478", code: "IT478", name: "Network Security", nameAr: "أمن الشبكات", credits: 3, prerequisites: ["it363"], type: "core", semester: 7 },
    { id: "it479", code: "IT479", name: "Senior Project I", nameAr: "مشروع التخرج الأول", credits: 3, prerequisites: ["it354", "it361"], type: "core", semester: 7 },
    // 8th Semester
    { id: "it484", code: "IT484", name: "Wireless Sensor Networks", nameAr: "شبكات الاستشعار اللاسلكية", credits: 3, prerequisites: ["it474"], type: "elective", semester: 8 },
    { id: "it485", code: "IT485", name: "Professional Ethics in IT", nameAr: "الأخلاق المهنية في تقنية المعلومات", credits: 3, prerequisites: ["it362"], type: "core", semester: 8 },
    { id: "it487", code: "IT487", name: "Mobile Application Development", nameAr: "تطوير تطبيقات الجوال", credits: 3, prerequisites: ["it475"], type: "elective", semester: 8 },
    { id: "it488", code: "IT488", name: "Cyber Forensics", nameAr: "الطب الشرعي الرقمي", credits: 3, prerequisites: ["it474"], type: "elective", semester: 8 },
    { id: "it489", code: "IT489", name: "Senior Project II", nameAr: "مشروع التخرج الثاني", credits: 3, prerequisites: ["it479"], type: "core", semester: 8 },
    { id: "it499", code: "IT499", name: "Practical Training", nameAr: "التدريب العملي", credits: 3, prerequisites: [], type: "core", hourRequirement: 86, semester: 8 }
  ]
};

// Data Science Major Data
const dsMajorData: MajorData = {
  id: "data-science",
  name: "Data Science",
  nameAr: "علم البيانات",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses) - Same as IT
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements - Same foundation with STAT201 instead of STAT101
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" },
    { id: "sci101", code: "SCI101", name: "General Physics 1", nameAr: "الفيزياء العامة 1", credits: 3, prerequisites: [], type: "core" },
    { id: "sci201", code: "SCI201", name: "General Physics 2", nameAr: "الفيزياء العامة 2", credits: 3, prerequisites: ["sci101"], type: "core" },
    { id: "math150", code: "MATH150", name: "Discrete Mathematics", nameAr: "الرياضيات المتقطعة", credits: 3, prerequisites: [], type: "core" },
    { id: "math251", code: "MATH251", name: "Linear Algebra", nameAr: "الجبر الخطي", credits: 3, prerequisites: ["math150"], type: "core" },
    { id: "eng103", code: "ENG103", name: "Technical Writing", nameAr: "الكتابة التقنية", credits: 3, prerequisites: [], type: "core" },
    { id: "stat201", code: "STAT201", name: "Introduction to Statistics and Probabilities", nameAr: "مقدمة في الإحصاء والاحتماليات", credits: 3, prerequisites: ["math150"], type: "core" }
  ],
  courses: [
    // Major Core Courses - 3rd Semester
    { id: "ds230", code: "DS230", name: "Object Oriented Programming", nameAr: "البرمجة الكائنية التوجه", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "ds231", code: "DS231", name: "Introduction to Data Science Programming", nameAr: "مقدمة في برمجة علم البيانات", credits: 3, prerequisites: [], type: "core", semester: 3 },
    
    // 4th Semester
    { id: "ds240", code: "DS240", name: "Data Structure", nameAr: "هياكل البيانات", credits: 3, prerequisites: ["ds230"], type: "core", semester: 4 },
    { id: "ds242", code: "DS242", name: "Advanced Data Science Programming", nameAr: "البرمجة المتقدمة لعلم البيانات", credits: 3, prerequisites: ["ds231"], type: "core", semester: 4 },
    { id: "ds243", code: "DS243", name: "Computer Architecture and Organization", nameAr: "معمارية وتنظيم الحاسوب", credits: 3, prerequisites: [], type: "core", semester: 4 },
    
    // 5th Semester
    { id: "ds350", code: "DS350", name: "Introduction to Database", nameAr: "مقدمة في قواعد البيانات", credits: 3, prerequisites: ["ds240"], type: "core", semester: 5 },
    { id: "ds351", code: "DS351", name: "Operating Systems", nameAr: "أنظمة التشغيل", credits: 3, prerequisites: ["ds243"], type: "core", semester: 5 },
    { id: "ds352", code: "DS352", name: "Design and Analysis of Algorithms", nameAr: "تصميم وتحليل الخوارزميات", credits: 3, prerequisites: ["ds240"], type: "core", semester: 5 },
    { id: "ds353", code: "DS353", name: "Project Management in Computing", nameAr: "إدارة المشاريع في الحوسبة", credits: 3, prerequisites: [], type: "core", semester: 5 },
    
    // 6th Semester
    { id: "ds360", code: "DS360", name: "Computer Networks", nameAr: "شبكات الحاسوب", credits: 3, prerequisites: ["ds243"], type: "core", semester: 6 },
    { id: "ds361", code: "DS361", name: "System Analysis and Design", nameAr: "تحليل وتصميم النظم", credits: 3, prerequisites: ["ds240"], type: "core", semester: 6 },
    { id: "ds362", code: "DS362", name: "Web Programming", nameAr: "برمجة الويب", credits: 3, prerequisites: ["ds350"], type: "core", semester: 6 },
    { id: "ds363", code: "DS363", name: "Artificial Intelligence", nameAr: "الذكاء الاصطناعي", credits: 3, prerequisites: ["ds352"], type: "core", semester: 6 },
    { id: "ds364", code: "DS364", name: "Data Curation (Management and Organization)", nameAr: "إدارة وتنظيم البيانات", credits: 3, prerequisites: ["ds350"], type: "core", semester: 6 },
    
    // 7th Semester
    { id: "ds470", code: "DS470", name: "Data Security and Privacy", nameAr: "أمن وخصوصية البيانات", credits: 3, prerequisites: ["ds364"], type: "core", semester: 7 },
    { id: "ds471", code: "DS471", name: "Machine Learning", nameAr: "تعلم الآلة", credits: 3, prerequisites: ["ds363"], type: "core", semester: 7 },
    { id: "ds472", code: "DS472", name: "Data Mining", nameAr: "تنقيب البيانات", credits: 3, prerequisites: ["ds364"], type: "core", semester: 7 },
    { id: "ds473", code: "DS473", name: "Computer Vision", nameAr: "رؤية الحاسوب", credits: 3, prerequisites: ["ds363"], type: "elective", semester: 7 },
    { id: "ds474", code: "DS474", name: "Decision Support Systems", nameAr: "أنظمة دعم القرار", credits: 3, prerequisites: ["ds363"], type: "elective", semester: 7 },
    { id: "ds479", code: "DS479", name: "Senior Project 1", nameAr: "مشروع التخرج الأول", credits: 3, prerequisites: ["ds361", "ds362"], type: "core", semester: 7 },
    
    // 8th Semester
    { id: "ds480", code: "DS480", name: "Data Visualization", nameAr: "تصور البيانات", credits: 3, prerequisites: ["ds472"], type: "core", semester: 8 },
    { id: "ds481", code: "DS481", name: "Professional Ethics in Data Science", nameAr: "الأخلاق المهنية في علم البيانات", credits: 3, prerequisites: [], type: "core", semester: 8 },
    { id: "ds482", code: "DS482", name: "Deep Learning", nameAr: "التعلم العميق", credits: 3, prerequisites: ["ds471"], type: "elective", semester: 8 },
    { id: "ds483", code: "DS483", name: "Natural Language Processing", nameAr: "معالجة اللغة الطبيعية", credits: 3, prerequisites: ["ds471"], type: "elective", semester: 8 },
    { id: "ds489", code: "DS489", name: "Senior Project 2", nameAr: "مشروع التخرج الثاني", credits: 3, prerequisites: ["ds479"], type: "core", semester: 8 },
    { id: "ds499", code: "DS499", name: "Practical Training", nameAr: "التدريب العملي", credits: 3, prerequisites: [], type: "core", hourRequirement: 86, semester: 8 }
  ]
};

// Computer Science Major Data
const csMajorData: MajorData = {
  id: "computer-science",
  name: "Computer Science",
  nameAr: "علوم الحاسوب",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses)
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements (10 courses)
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" },
    { id: "sci101", code: "SCI101", name: "General Physics 1", nameAr: "الفيزياء العامة 1", credits: 3, prerequisites: [], type: "core" },
    { id: "sci201", code: "SCI201", name: "General Physics 2", nameAr: "الفيزياء العامة 2", credits: 3, prerequisites: ["sci101"], type: "core" },
    { id: "math150", code: "MATH150", name: "Discrete Mathematics", nameAr: "الرياضيات المتقطعة", credits: 3, prerequisites: [], type: "core" },
    { id: "math251", code: "MATH251", name: "Linear Algebra", nameAr: "الجبر الخطي", credits: 3, prerequisites: ["math150"], type: "core" },
    { id: "eng103", code: "ENG103", name: "Technical Writing", nameAr: "الكتابة التقنية", credits: 3, prerequisites: [], type: "core" },
    { id: "stat101", code: "STAT101", name: "Statistics", nameAr: "الإحصاء", credits: 3, prerequisites: [], type: "core" }
  ],
  courses: [
    // Major Core Courses - 3rd Semester
    { id: "cs230", code: "CS230", name: "Object Oriented Programming", nameAr: "البرمجة الكائنية التوجه", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "cs231", code: "CS231", name: "Digital Logic Design", nameAr: "تصميم المنطق الرقمي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    
    // 4th Semester
    { id: "cs240", code: "CS240", name: "Data Structure", nameAr: "هياكل البيانات", credits: 3, prerequisites: ["cs230"], type: "core", semester: 4 },
    { id: "cs241", code: "CS241", name: "Computer Architecture and Organization", nameAr: "معمارية وتنظيم الحاسوب", credits: 3, prerequisites: ["cs231"], type: "core", semester: 4 },
    { id: "cs242", code: "CS242", name: "Theory of Computing", nameAr: "نظرية الحوسبة", credits: 3, prerequisites: ["cs230"], type: "core", semester: 4 },
    { id: "cs243", code: "CS243", name: "Discrete Mathematics for CS", nameAr: "الرياضيات المتقطعة لعلوم الحاسوب", credits: 3, prerequisites: ["math150"], type: "core", semester: 4 },
    
    // 5th Semester
    { id: "cs350", code: "CS350", name: "Introduction to Database", nameAr: "مقدمة في قواعد البيانات", credits: 3, prerequisites: ["cs240"], type: "core", semester: 5 },
    { id: "cs351", code: "CS351", name: "Operating Systems", nameAr: "أنظمة التشغيل", credits: 3, prerequisites: ["cs241"], type: "core", semester: 5 },
    { id: "cs352", code: "CS352", name: "System Analysis and Design", nameAr: "تحليل وتصميم النظم", credits: 3, prerequisites: ["cs230"], type: "core", semester: 5 },
    { id: "cs353", code: "CS353", name: "Design and Analysis of Algorithms", nameAr: "تصميم وتحليل الخوارزميات", credits: 3, prerequisites: ["cs240", "cs242"], type: "core", semester: 5 },
    
    // 6th Semester
    { id: "cs360", code: "CS360", name: "Computer Networks", nameAr: "شبكات الحاسوب", credits: 3, prerequisites: ["cs351"], type: "core", semester: 6 },
    { id: "cs361", code: "CS361", name: "Web Programming", nameAr: "برمجة الويب", credits: 3, prerequisites: ["cs350"], type: "core", semester: 6 },
    { id: "cs362", code: "CS362", name: "Artificial Intelligence", nameAr: "الذكاء الاصطناعي", credits: 3, prerequisites: ["cs353"], type: "core", semester: 6 },
    { id: "cs363", code: "CS363", name: "Principles of Programming Languages", nameAr: "مبادئ لغات البرمجة", credits: 3, prerequisites: ["cs240"], type: "core", semester: 6 },
    { id: "cs364", code: "CS364", name: "Computing Entrepreneurship and Innovation", nameAr: "ريادة الأعمال والابتكار في الحوسبة", credits: 3, prerequisites: ["cs350"], type: "core", semester: 6 },
    
    // 7th Semester
    { id: "cs470", code: "CS470", name: "Human Computer Interaction", nameAr: "التفاعل بين الإنسان والحاسوب", credits: 3, prerequisites: ["cs352"], type: "core", semester: 7 },
    { id: "cs471", code: "CS471", name: "Computer Security", nameAr: "أمن الحاسوب", credits: 3, prerequisites: ["cs360"], type: "core", semester: 7 },
    { id: "cs475", code: "CS475", name: "Mobile Computing", nameAr: "الحوسبة المتنقلة", credits: 3, prerequisites: ["cs363"], type: "elective", semester: 7 },
    { id: "cs476", code: "CS476", name: "Parallel and Distributed Computing", nameAr: "الحوسبة المتوازية والموزعة", credits: 3, prerequisites: ["cs363"], type: "elective", semester: 7 },
    { id: "cs479", code: "CS479", name: "Senior Project 1 in Computer Science", nameAr: "مشروع التخرج الأول في علوم الحاسوب", credits: 3, prerequisites: ["cs350", "cs352"], type: "core", semester: 7 },
    
    // 8th Semester
    { id: "cs477", code: "CS477", name: "Compiler Design", nameAr: "تصميم المترجمات", credits: 3, prerequisites: ["cs363"], type: "elective", semester: 8 },
    { id: "cs478", code: "CS478", name: "Computer Graphics", nameAr: "رسوميات الحاسوب", credits: 3, prerequisites: ["cs363"], type: "elective", semester: 8 },
    { id: "cs480", code: "CS480", name: "Project Management in Computing", nameAr: "إدارة المشاريع في الحوسبة", credits: 3, prerequisites: ["cs352"], type: "core", semester: 8 },
    { id: "cs481", code: "CS481", name: "Professional Ethics in Computer Science", nameAr: "الأخلاق المهنية في علوم الحاسوب", credits: 3, prerequisites: [], type: "core", semester: 8 },
    { id: "cs489", code: "CS489", name: "Senior Project 2 in Computer Science", nameAr: "مشروع التخرج الثاني في علوم الحاسوب", credits: 3, prerequisites: ["cs479"], type: "core", semester: 8 },
    { id: "cs499", code: "CS499", name: "Practical Training", nameAr: "التدريب العملي", credits: 3, prerequisites: [], type: "core", hourRequirement: 86, semester: 8 }
  ]
};

// Health Informatics Major Data
const hiMajorData: MajorData = {
  id: "health-informatics",
  name: "Health Informatics",
  nameAr: "المعلوماتية الصحية",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses)
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements (4 courses)
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" }
  ],
  courses: [
    // Semester 3
    { id: "bio101", code: "BIO101", name: "Basic Medical Terminology", nameAr: "المصطلحات الطبية الأساسية", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "hcm101", code: "HCM101", name: "Health Care Management", nameAr: "إدارة الرعاية الصحية", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "hcm102", code: "HCM102", name: "Organizational Behavior", nameAr: "السلوك التنظيمي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "phc121", code: "PHC121", name: "Introduction to Biostatistics", nameAr: "مقدمة في الإحصاء الحيوي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "it231", code: "IT231", name: "Introduction to IT and IS", nameAr: "مقدمة في تقنية المعلومات ونظم المعلومات", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "it232", code: "IT232", name: "Object Oriented Programming", nameAr: "البرمجة الكائنية التوجه", credits: 3, prerequisites: [], type: "core", semester: 3 },
    
    // Semester 4
    { id: "bio102", code: "BIO102", name: "Introduction to Anatomy and Physiology", nameAr: "مقدمة في علم التشريح ووظائف الأعضاء", credits: 3, prerequisites: ["bio101"], type: "core", semester: 4 },
    { id: "it244", code: "IT244", name: "Introduction to Database", nameAr: "مقدمة في قواعد البيانات", credits: 3, prerequisites: ["it232"], type: "core", semester: 4 },
    { id: "it245", code: "IT245", name: "Data Structure", nameAr: "هياكل البيانات", credits: 3, prerequisites: ["it232"], type: "core", semester: 4 },
    { id: "phc131", code: "PHC131", name: "Introduction to Epidemiology", nameAr: "مقدمة في علم الأوبئة", credits: 3, prerequisites: ["phc121"], type: "core", semester: 4 },
    { id: "hcm113", code: "HCM113", name: "Health Policy & Saudi Healthcare System", nameAr: "السياسة الصحية ونظام الرعاية الصحية السعودي", credits: 3, prerequisites: ["hcm101"], type: "core", semester: 4 },
    
    // Semester 5
    { id: "phc212", code: "PHC212", name: "Concepts of Health Education and Promotion", nameAr: "مفاهيم التثقيف الصحي والترويج", credits: 3, prerequisites: ["bio101"], type: "core", semester: 5 },
    { id: "it351", code: "IT351", name: "Computer Networks", nameAr: "شبكات الحاسوب", credits: 3, prerequisites: ["it231"], type: "core", semester: 5 },
    { id: "it352", code: "IT352", name: "Human Computer Interaction", nameAr: "التفاعل بين الإنسان والحاسوب", credits: 3, prerequisites: ["it231", "it245"], type: "core", semester: 5 },
    { id: "hci111", code: "HCI111", name: "Introduction to Health Informatics", nameAr: "مقدمة في المعلوماتية الصحية", credits: 3, prerequisites: [], type: "core", semester: 5 },
    { id: "it353", code: "IT353", name: "System Analysis and Design", nameAr: "تحليل وتصميم النظم", credits: 3, prerequisites: ["it245"], type: "core", semester: 5 },
    
    // Semester 6
    { id: "hcm213", code: "HCM213", name: "Financial Management for Healthcare", nameAr: "الإدارة المالية للرعاية الصحية", credits: 3, prerequisites: ["hcm101"], type: "core", semester: 6 },
    { id: "phc215", code: "PHC215", name: "Healthcare Research", nameAr: "بحوث الرعاية الصحية", credits: 3, prerequisites: ["phc131"], type: "core", semester: 6 },
    { id: "it362", code: "IT362", name: "IT Project Management", nameAr: "إدارة مشاريع تقنية المعلومات", credits: 3, prerequisites: ["it353"], type: "core", semester: 6 },
    { id: "phc216", code: "PHC216", name: "Ethics & Regulations in Healthcare", nameAr: "الأخلاق واللوائح في الرعاية الصحية", credits: 3, prerequisites: ["hcm113"], type: "core", semester: 6 },
    { id: "hci112", code: "HCI112", name: "Electronic Health Records", nameAr: "السجلات الصحية الإلكترونية", credits: 3, prerequisites: ["hci111", "it231"], type: "core", semester: 6 },
    { id: "it361", code: "IT361", name: "Web Technologies", nameAr: "تقنيات الويب", credits: 3, prerequisites: ["it352", "it244"], type: "core", semester: 6 },
    
    // Semester 7
    { id: "it475", code: "IT475", name: "Decision Support Systems", nameAr: "أنظمة دعم القرار", credits: 3, prerequisites: ["it244"], type: "core", semester: 7 },
    { id: "it476", code: "IT476", name: "IT Security & Policies", nameAr: "أمن تقنية المعلومات والسياسات", credits: 3, prerequisites: ["it351"], type: "core", semester: 7 },
    { id: "hci214", code: "HCI214", name: "Consumer Health Informatics", nameAr: "معلوماتية صحة المستهلك", credits: 3, prerequisites: ["hci112"], type: "core", semester: 7 },
    { id: "hci213", code: "HCI213", name: "Medical Coding and Billing", nameAr: "الترميز الطبي والفواتير", credits: 3, prerequisites: ["hci111", "hci112"], type: "core", semester: 7 },
    { id: "phc312", code: "PHC312", name: "Health Communications", nameAr: "الاتصالات الصحية", credits: 3, prerequisites: ["phc216"], type: "core", semester: 7 },
    
    // Semester 8
    { id: "hci315", code: "HCI315", name: "Telehealth and Telemedicine", nameAr: "الصحة عن بُعد والطب عن بُعد", credits: 3, prerequisites: ["hci213"], type: "core", semester: 8 },
    { id: "hci316", code: "HCI316", name: "E-Health", nameAr: "الصحة الإلكترونية", credits: 3, prerequisites: ["hci214"], type: "core", semester: 8 },
    { id: "hci314", code: "HCI314", name: "Public Health Informatics", nameAr: "معلوماتية الصحة العامة", credits: 3, prerequisites: ["hci213"], type: "core", semester: 8 },
    
    // Electives (Student chooses 2)
    { id: "it487", code: "IT487", name: "Mobile Application Development", nameAr: "تطوير تطبيقات الجوال", credits: 3, prerequisites: ["phc312", "hci213", "hci214"], type: "elective", semester: 8 },
    { id: "it364", code: "IT364", name: "IT Innovation and Entrepreneurship", nameAr: "الابتكار وريادة الأعمال في تقنية المعلومات", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "it485", code: "IT485", name: "Professional Ethics in IT", nameAr: "الأخلاق المهنية في تقنية المعلومات", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "ecom101", code: "ECOM101", name: "E-Commerce", nameAr: "التجارة الإلكترونية", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc101", code: "PHC101", name: "Introduction to Public Health", nameAr: "مقدمة في الصحة العامة", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc151", code: "PHC151", name: "Environmental Health", nameAr: "الصحة البيئية", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc261", code: "PHC261", name: "Occupational Health", nameAr: "الصحة المهنية", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc273", code: "PHC273", name: "Introduction to Mental Health", nameAr: "مقدمة في الصحة النفسية", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc311", code: "PHC311", name: "Global Health", nameAr: "الصحة العالمية", credits: 3, prerequisites: [], type: "elective", semester: 8 }
  ]
};

// Public Health Major Data
const phMajorData: MajorData = {
  id: "public-health",
  name: "Public Health",
  nameAr: "الصحة العامة",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses)
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements (4 courses)
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" }
  ],
  courses: [
    // Semester 3
    { id: "biol101", code: "BIOL 101", name: "Basic Medical Terminology", nameAr: "المصطلحات الطبية الأساسية", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "hcm101", code: "HCM 101", name: "Health Care Management", nameAr: "إدارة الرعاية الصحية", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "hcm102", code: "HCM 102", name: "Organizational Behavior", nameAr: "السلوك التنظيمي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "phc121", code: "PHC 121", name: "Introduction to Biostatistics", nameAr: "مقدمة في الإحصاء الحيوي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "phc101", code: "PHC 101", name: "Introduction to Public Health", nameAr: "مقدمة في الصحة العامة", credits: 3, prerequisites: [], type: "core", semester: 3 },

    // Semester 4
    { id: "biol102", code: "BIOL 102", name: "Introduction to Anatomy and Physiology", nameAr: "مقدمة في علم التشريح ووظائف الأعضاء", credits: 3, prerequisites: ["biol101"], type: "core", semester: 4 },
    { id: "biol103", code: "BIOL 103", name: "Principles of Microbiology for Public Health", nameAr: "مبادئ علم الأحياء الدقيقة للصحة العامة", credits: 3, prerequisites: ["biol101"], type: "core", semester: 4 },
    { id: "hcm113", code: "HCM 113", name: "Health Policy & Saudi Healthcare System", nameAr: "السياسة الصحية ونظام الرعاية الصحية السعودي", credits: 3, prerequisites: ["hcm101"], type: "core", semester: 4 },
    { id: "phc131", code: "PHC 131", name: "Introduction to Epidemiology", nameAr: "مقدمة في علم الأوبئة", credits: 3, prerequisites: ["phc121"], type: "core", semester: 4 },
    { id: "phc151", code: "PHC 151", name: "Environmental Health", nameAr: "الصحة البيئية", credits: 3, prerequisites: ["phc101"], type: "core", semester: 4 },
    { id: "phc181", code: "PHC 181", name: "Sociology of Health, Illness and Healthcare", nameAr: "علم اجتماع الصحة والمرض والرعاية الصحية", credits: 3, prerequisites: [], type: "core", semester: 4 },

    // Semester 5
    { id: "phc212", code: "PHC 212", name: "Concepts of Health Education and Promotion", nameAr: "مفاهيم التثقيف الصحي والترويج", credits: 3, prerequisites: ["biol101"], type: "core", semester: 5 },
    { id: "phc241", code: "PHC 241", name: "Fundamental Concepts in Food and Nutrition", nameAr: "المفاهيم الأساسية في الغذاء والتغذية", credits: 3, prerequisites: ["phc101"], type: "core", semester: 5 },
    { id: "phc261", code: "PHC 261", name: "Occupational Health", nameAr: "الصحة المهنية", credits: 3, prerequisites: ["phc151"], type: "core", semester: 5 },
    { id: "phc271", code: "PHC 271", name: "Introduction to Disease", nameAr: "مقدمة في الأمراض", credits: 3, prerequisites: ["biol103"], type: "core", semester: 5 },
    { id: "phc281", code: "PHC 281", name: "Health Behavior", nameAr: "السلوك الصحي", credits: 3, prerequisites: ["phc181"], type: "core", semester: 5 },

    // Semester 6
    { id: "hcm213", code: "HCM 213", name: "Financial Management for Healthcare", nameAr: "الإدارة المالية للرعاية الصحية", credits: 3, prerequisites: ["hcm101"], type: "core", semester: 6 },
    { id: "phc215", code: "PHC 215", name: "Healthcare Research Methods and Analysis", nameAr: "طرق وتحليل البحوث الصحية", credits: 3, prerequisites: ["phc131"], type: "core", semester: 6 },
    { id: "phc216", code: "PHC 216", name: "Ethics and Regulation in Health Care", nameAr: "الأخلاق واللوائح في الرعاية الصحية", credits: 3, prerequisites: ["hcm113"], type: "core", semester: 6 },
    { id: "phc231", code: "PHC 231", name: "Introduction to Hospital Epidemiology", nameAr: "مقدمة في علم الأوبئة المستشفيات", credits: 3, prerequisites: ["phc131"], type: "core", semester: 6 },
    { id: "phc273", code: "PHC 273", name: "Introduction to Mental Health", nameAr: "مقدمة في الصحة النفسية", credits: 3, prerequisites: ["phc281"], type: "core", semester: 6 },
    { id: "phc274", code: "PHC 274", name: "Health Planning", nameAr: "التخطيط الصحي", credits: 3, prerequisites: ["phc212"], type: "core", semester: 6 },

    // Semester 7
    { id: "phc311", code: "PHC 311", name: "Global Health", nameAr: "الصحة العالمية", credits: 3, prerequisites: ["phc101"], type: "core", semester: 7 },
    { id: "phc312", code: "PHC 312", name: "Health Communication", nameAr: "الاتصال الصحي", credits: 3, prerequisites: ["phc216"], type: "core", semester: 7 },
    { id: "phc313", code: "PHC 313", name: "Road Traffic Injuries and Disability Prevention", nameAr: "إصابات حوادث المرور ومنع الإعاقة", credits: 3, prerequisites: ["phc281"], type: "core", semester: 7 },
    { id: "phc331", code: "PHC 331", name: "Chronic Disease Epidemiology and Prevention", nameAr: "علم أوبئة الأمراض المزمنة والوقاية", credits: 3, prerequisites: ["phc131"], type: "core", semester: 7 },
    { id: "phc372", code: "PHC 372", name: "Public Health Outbreak and Disaster Management", nameAr: "إدارة تفشي الأمراض والكوارث الصحية العامة", credits: 3, prerequisites: ["phc231"], type: "core", semester: 7 },
    { id: "phc373", code: "PHC 373", name: "Maternal and Child Health", nameAr: "صحة الأم والطفل", credits: 3, prerequisites: ["phc271", "phc281"], type: "core", semester: 7 },

    // Semester 8
    { id: "phc374", code: "PHC 374", name: "Oral Health Promotion", nameAr: "تعزيز صحة الفم", credits: 3, prerequisites: ["phc281", "phc212"], type: "core", semester: 8 },
    { id: "phc314", code: "PHC 314", name: "Society and Addiction", nameAr: "المجتمع والإدمان", credits: 3, prerequisites: ["phc312", "phc273"], type: "core", semester: 8 },

    // Track Electives (Student chooses 3 courses from one track in semester 8)
    // Track 1: Epidemiology and Biostatistics
    { id: "phc321", code: "PHC 321", name: "Applied Biostatistics", nameAr: "الإحصاء الحيوي التطبيقي", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc332", code: "PHC 332", name: "Advanced Epidemiology", nameAr: "علم الأوبئة المتقدم", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc335", code: "PHC 335", name: "Cancer Risk and Prevention", nameAr: "مخاطر السرطان والوقاية", credits: 3, prerequisites: [], type: "elective", semester: 8 },

    // Track 2: Environmental and Occupational Health
    { id: "phc351", code: "PHC 351", name: "Health and Environmental Risk Assessment", nameAr: "تقييم المخاطر الصحية والبيئية", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc361", code: "PHC 361", name: "Safety Fundamentals", nameAr: "أساسيات السلامة", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc362", code: "PHC 362", name: "Workplace Health Promotion", nameAr: "تعزيز الصحة في مكان العمل", credits: 3, prerequisites: [], type: "elective", semester: 8 },

    // Track 3: Health Education and Promotion
    { id: "phc315", code: "PHC 315", name: "Public Health Program Evaluation", nameAr: "تقييم برامج الصحة العامة", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc375", code: "PHC 375", name: "Promoting Physical Activity and Health", nameAr: "تعزيز النشاط البدني والصحة", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "phc376", code: "PHC 376", name: "Health Promotion and Later Life", nameAr: "تعزيز الصحة والحياة المتأخرة", credits: 3, prerequisites: [], type: "elective", semester: 8 }
  ]
};

// Management Major Data
const mgmtMajorData: MajorData = {
  id: "management",
  name: "Business Administration (Management)",
  nameAr: "إدارة الأعمال (الإدارة)",
  totalCredits: 130,
  universityRequirements: [
    // Common First Year - University Requirements (6 courses)
    { id: "eng001", code: "ENG001", name: "English Skills 1", nameAr: "مهارات اللغة الإنجليزية 1", credits: 8, prerequisites: [], type: "general" },
    { id: "eng002", code: "ENG002", name: "English Skills 2", nameAr: "مهارات اللغة الإنجليزية 2", credits: 8, prerequisites: [], type: "general" },
    { id: "cs001", code: "CS001", name: "Computer Essentials", nameAr: "أساسيات الحاسوب", credits: 3, prerequisites: [], type: "general" },
    { id: "math001", code: "MATH001", name: "Fundamentals of Mathematics", nameAr: "أساسيات الرياضيات", credits: 3, prerequisites: [], type: "general" },
    { id: "comm001", code: "COMM001", name: "Communication Skills", nameAr: "مهارات التواصل", credits: 2, prerequisites: [], type: "general" },
    { id: "ci001", code: "CI001", name: "Academic Skills", nameAr: "المهارات الأكاديمية", credits: 2, prerequisites: [], type: "general" }
  ],
  sharedFirstYearCourses: [
    // Shared College Requirements (4 courses)
    { id: "islm101", code: "ISLM101", name: "Islamic Course 1", nameAr: "المقرر الإسلامي 1", credits: 2, prerequisites: [], type: "general" },
    { id: "islm102", code: "ISLM102", name: "Islamic Course 2", nameAr: "المقرر الإسلامي 2", credits: 2, prerequisites: [], type: "general" },
    { id: "islm103", code: "ISLM103", name: "Islamic Course 3", nameAr: "المقرر الإسلامي 3", credits: 2, prerequisites: ["islm101"], type: "general" },
    { id: "islm104", code: "ISLM104", name: "Islamic Course 4", nameAr: "المقرر الإسلامي 4", credits: 2, prerequisites: ["islm102"], type: "general" }
  ],
  courses: [
    // College Level Courses (Foundation)
    { id: "acct101", code: "ACCT101", name: "Principles of Accounting", nameAr: "مبادئ المحاسبة", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "acct301", code: "ACCT301", name: "Cost Accounting", nameAr: "محاسبة التكاليف", credits: 3, prerequisites: ["acct101"], type: "core", semester: 5 },
    { id: "ecom101", code: "ECOM101", name: "E-Commerce", nameAr: "التجارة الإلكترونية", credits: 3, prerequisites: [], type: "core", semester: 4 },
    { id: "ecom201", code: "ECOM201", name: "Introduction to E-Management", nameAr: "مقدمة في الإدارة الإلكترونية", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 6 },
    { id: "econ101", code: "ECON101", name: "Microeconomics", nameAr: "الاقتصاد الجزئي", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "econ201", code: "ECON201", name: "Macroeconomics", nameAr: "الاقتصاد الكلي", credits: 3, prerequisites: ["econ101"], type: "core", semester: 6 },
    { id: "fin101", code: "FIN101", name: "Principles of Finance", nameAr: "مبادئ التمويل", credits: 3, prerequisites: ["acct101"], type: "core", semester: 4 },
    { id: "law101", code: "LAW101", name: "Legal Environment of Business", nameAr: "البيئة القانونية للأعمال", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "mgt101", code: "MGT101", name: "Principles of Management", nameAr: "مبادئ الإدارة", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "mgt201", code: "MGT201", name: "Marketing Management", nameAr: "إدارة التسويق", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 4 },
    { id: "mgt211", code: "MGT211", name: "HR Management", nameAr: "إدارة الموارد البشرية", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 4 },
    { id: "mgt301", code: "MGT301", name: "Organizational Behavior", nameAr: "السلوك التنظيمي", credits: 3, prerequisites: ["mgt211"], type: "core", semester: 7 },
    { id: "mgt311", code: "MGT311", name: "Introduction to Operations Management", nameAr: "مقدمة في إدارة العمليات", credits: 3, prerequisites: ["mgt101", "stat101"], type: "core", semester: 6 },
    { id: "mgt321", code: "MGT321", name: "Introduction to International Business", nameAr: "مقدمة في الأعمال الدولية", credits: 3, prerequisites: [], type: "core", semester: 5 },
    { id: "mgt322", code: "MGT322", name: "Logistics Management", nameAr: "إدارة اللوجستيات", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 5 },
    { id: "mgt401", code: "MGT401", name: "Strategic Management", nameAr: "الإدارة الاستراتيجية", credits: 3, prerequisites: ["mgt201", "fin101"], type: "core", semester: 7 },
    { id: "mis201", code: "MIS201", name: "Management of Information Systems", nameAr: "إدارة نظم المعلومات", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 6 },
    { id: "stat101", code: "STAT101", name: "Statistics", nameAr: "الإحصاء", credits: 3, prerequisites: [], type: "core", semester: 3 },
    { id: "stat201", code: "STAT201", name: "Quantitative Methods", nameAr: "الطرق الكمية", credits: 3, prerequisites: ["stat101"], type: "core", semester: 4 },

    // Major Specialization Courses
    { id: "mgt312", code: "MGT312", name: "Decision Making and Problem Solving", nameAr: "اتخاذ القرارات وحل المشكلات", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 5 },
    { id: "mgt323", code: "MGT323", name: "Project Management", nameAr: "إدارة المشاريع", credits: 3, prerequisites: ["mgt311"], type: "core", semester: 6 },
    { id: "mgt324", code: "MGT324", name: "Public Management", nameAr: "الإدارة العامة", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 6 },
    { id: "mgt402", code: "MGT402", name: "Entrepreneurship & Small Business", nameAr: "ريادة الأعمال والمشاريع الصغيرة", credits: 3, prerequisites: ["mgt101"], type: "core", semester: 7 },
    { id: "mgt403", code: "MGT403", name: "Knowledge Management", nameAr: "إدارة المعرفة", credits: 3, prerequisites: [], type: "core", semester: 7 },
    { id: "mgt404", code: "MGT404", name: "Organization Design and Development", nameAr: "تصميم وتطوير المنظمات", credits: 3, prerequisites: [], type: "core", semester: 8 },
    { id: "mgt421", code: "MGT421", name: "Communications Management", nameAr: "إدارة الاتصالات", credits: 3, prerequisites: [], type: "core", semester: 8 },
    { id: "mgt422", code: "MGT422", name: "Business Ethics & Social Responsibility", nameAr: "أخلاقيات الأعمال والمسؤولية الاجتماعية", credits: 3, prerequisites: [], type: "core", semester: 8 },
    { id: "mgt430", code: "MGT430", name: "Internship", nameAr: "التدريب العملي", credits: 6, prerequisites: [], type: "core", hourRequirement: 90, semester: 8 },

    // Concentration Electives (Student chooses one concentration)
    // Business Administration Concentration
    { id: "mgt325", code: "MGT325", name: "Management of Technology", nameAr: "إدارة التكنولوجيا", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "mgt424", code: "MGT424", name: "Quality Management", nameAr: "إدارة الجودة", credits: 3, prerequisites: [], type: "elective", semester: 8 },
    { id: "mgt425", code: "MGT425", name: "Spreadsheet Decision Modeling", nameAr: "نمذجة القرارات بالجداول الإلكترونية", credits: 3, prerequisites: [], type: "elective", semester: 8 },

    // E-Commerce Concentration
    { id: "ecom301", code: "ECOM301", name: "E-Marketing", nameAr: "التسويق الإلكتروني", credits: 3, prerequisites: ["mgt201"], type: "elective", semester: 8 },
    { id: "ecom421", code: "ECOM421", name: "E-Business Strategies and Business Models", nameAr: "استراتيجيات الأعمال الإلكترونية ونماذج الأعمال", credits: 3, prerequisites: ["mgt401"], type: "elective", semester: 8 },
    { id: "it404", code: "IT404", name: "Web Design", nameAr: "تصميم الويب", credits: 3, prerequisites: [], type: "elective", semester: 8 },

    // Accounting Concentration
    { id: "acct201", code: "ACCT201", name: "Financial Accounting", nameAr: "المحاسبة المالية", credits: 3, prerequisites: ["acct101"], type: "elective", semester: 8 },
    { id: "acct402", code: "ACCT402", name: "Introduction to Accounting Information Systems", nameAr: "مقدمة في نظم المعلومات المحاسبية", credits: 3, prerequisites: ["acct101", "mis201"], type: "elective", semester: 8 },
    { id: "acct422", code: "ACCT422", name: "Tax & Zakat Accounting", nameAr: "محاسبة الضرائب والزكاة", credits: 3, prerequisites: ["acct201"], type: "elective", semester: 8 },

    // Finance Concentration
    { id: "fin201", code: "FIN201", name: "Corporate Finance", nameAr: "التمويل المؤسسي", credits: 3, prerequisites: ["fin101"], type: "elective", semester: 8 },
    { id: "fin401", code: "FIN401", name: "Banks Management", nameAr: "إدارة البنوك", credits: 3, prerequisites: ["fin101"], type: "elective", semester: 8 },
    { id: "fin402", code: "FIN402", name: "Financial Institutions and Markets", nameAr: "المؤسسات والأسواق المالية", credits: 3, prerequisites: ["fin101"], type: "elective", semester: 8 }
  ]
};

export default function ClientMajorPage({ params }: Readonly<{ params: { slug: string } }>) {
  const router = useRouter();
  const { isArabic } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedFirstYear, setHasCompletedFirstYear] = useState<boolean | null>(null);
  const [completedSharedCourses, setCompletedSharedCourses] = useState<string[]>([]);
  const [completedUniversityCourses, setCompletedUniversityCourses] = useState<string[]>([]); // Added for university requirements
  const [completedSemesters, setCompletedSemesters] = useState<number>(0);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [customTerm, setCustomTerm] = useState<Course[]>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  // Zustand store for schedules persisted in localStorage
  const { schedules: storeSchedules, setSchedule, removeSchedule } = useScheduleStore();
  const getKey = (courseId: string) => `${params.slug}:${courseId}`;
  const getSchedule = (courseId: string): ScheduleEntry => {
    const key = getKey(courseId);
    const s = storeSchedules[key];
    return s
    ? { courseId, day: s.day || 'sunday-tuesday', start: s.start || '3:00', end: s.end || '3:50', crn: s.crn || '' }
      : { courseId, day: 'sunday-tuesday', start: '3:00', end: '3:50', crn: '' };
  };
  const setScheduleField = (courseId: string, field: keyof ScheduleEntry, value: string) => {
    const key = getKey(courseId);
    // Ensure end follows start if start changes
    if (field === 'start') {
      const end = endTimeForStart(value);
      setSchedule(key, { start: value, end });
    } else if (field === 'end') {
      setSchedule(key, { end: value });
    } else if (field === 'day') {
      setSchedule(key, { day: value as Day });
    } else if (field === 'crn') {
      setSchedule(key, { crn: value });
    }
  };

  // Keep track of schedule updates for debugging
  console.log('Current course schedules:', Object.keys(storeSchedules).length);

  // Get major data based on slug
  const getMajorData = (slug: string): MajorData => {
    switch (slug) {
      case 'information-technology':
        return itMajorData;
      case 'data-science':
        return dsMajorData;
      case 'computer-science':
        return csMajorData;
      case 'health-informatics':
        return hiMajorData;
      case 'public-health':
        return phMajorData;
      case 'management':
        return mgmtMajorData;
      default:
        return itMajorData; // fallback
    }
  };

  const majorData = getMajorData(params.slug);

  // Function to auto-complete courses based on completed semesters
  const getCompletedCoursesBySemester = (semesterCount: number) => {
    const coursesBySemester: string[] = [];
    
    // Auto-complete courses up to the specified semester
    for (let semester = 3; semester <= semesterCount; semester++) {
      const semesterCourses = majorData.courses
        .filter(course => course.semester === semester && course.type === "core")
        .map(course => course.id);
      coursesBySemester.push(...semesterCourses);
    }
    
    return coursesBySemester;
  };

  // Calculate statistics
  const completedCredits = [...completedSharedCourses, ...completedUniversityCourses, ...completedCourses]
    .reduce((total, courseId) => {
      const course = [...majorData.sharedFirstYearCourses, ...majorData.universityRequirements, ...majorData.courses]
        .find(c => c.id === courseId);
      return total + (course?.credits || 0);
    }, 0);

  const remainingCredits = majorData.totalCredits - completedCredits;
  const totalCompletedCourses = completedSharedCourses.length + completedUniversityCourses.length + completedCourses.length;
  const totalCourses = majorData.sharedFirstYearCourses.length + majorData.universityRequirements.length + majorData.courses.length;
  const remainingCourses = totalCourses - totalCompletedCourses;

  // Get available courses for registration
  const getAvailableCourses = () => {
    // If first year is not completed, show only university requirements
    if (hasCompletedFirstYear === false) {
      return majorData.universityRequirements.filter(course => 
        !completedUniversityCourses.includes(course.id) && 
        !customTerm.some(termCourse => termCourse.id === course.id)
      );
    }
    
    // If first year is completed, show shared courses + major courses based on prerequisites
    const allCompleted = [...completedSharedCourses, ...completedUniversityCourses, ...completedCourses];
    const availableSharedCourses = majorData.sharedFirstYearCourses.filter(course => {
      if (allCompleted.includes(course.id)) return false;
      if (customTerm.some(termCourse => termCourse.id === course.id)) return false;
      return course.prerequisites.every(prereq => allCompleted.includes(prereq));
    });
    
    const availableMajorCourses = majorData.courses.filter(course => {
      if (allCompleted.includes(course.id)) return false;
      if (customTerm.some(termCourse => termCourse.id === course.id)) return false;
      
      const prerequisitesMet = course.prerequisites.every(prereq => allCompleted.includes(prereq));
      
      if (course.hourRequirement) {
        const totalHoursCompleted = allCompleted.reduce((total, courseId) => {
          const completedCourse = [...majorData.sharedFirstYearCourses, ...majorData.universityRequirements, ...majorData.courses]
            .find(c => c.id === courseId);
          return total + (completedCourse?.credits || 0);
        }, 0);
        
        return prerequisitesMet && totalHoursCompleted >= course.hourRequirement;
      }
      
      return prerequisitesMet;
    });
    
    return [...availableSharedCourses, ...availableMajorCourses];
  };

  const questionnaire = [
    {
      question: isArabic ? "هل أكملت السنة الأولى المشتركة؟" : "Have you completed the common first year?",
      type: "yesno" as const,
      key: "firstYear"
    },
    {
      question: isArabic ? "ما هي متطلبات الجامعة التي أكملتها؟" : "Which university requirements have you completed?",
      type: "multiple" as const,
      key: "universityCourses",
      options: majorData.universityRequirements,
      showWhen: () => hasCompletedFirstYear === false
    },
    {
      question: isArabic ? "ما هي المقررات المشتركة التي أكملتها؟" : "Which shared college courses have you completed?",
      type: "multiple" as const,
      key: "sharedCourses",
      options: majorData.sharedFirstYearCourses,
      showWhen: () => hasCompletedFirstYear === true
    },
    {
      question: isArabic ? "كم فصل دراسي أكملت؟" : "How many semesters have you completed?",
      type: "number" as const,
      key: "semesters"
    }
  ].filter(q => !q.showWhen || q.showWhen());

  const handleQuestionnaireSubmit = () => {
    if (hasCompletedFirstYear === false) {
      // For students who haven't completed first year, clear shared courses
      setCompletedSharedCourses([]);
      setCompletedCourses([]);
    } else {
      // For students who completed first year, mark university requirements as completed
      setCompletedUniversityCourses(majorData.universityRequirements.map(c => c.id));
      
      // Auto-complete major core courses based on completed semesters
      if (completedSemesters >= 3) {
        const autoCompletedCourses = getCompletedCoursesBySemester(completedSemesters);
        setCompletedCourses(autoCompletedCourses);
      }
    }
    setShowQuestionnaire(false);
  };

  const addToCustomTerm = (course: Course) => {
    if (customTerm.length < 6 && !customTerm.find(c => c.id === course.id)) {
      setCustomTerm([...customTerm, course]);
      // Initialize schedule entry for the new course in store
      setSchedule(getKey(course.id), { day: 'sunday-tuesday', start: '3:00', end: '3:50', crn: '' });
    }
  };

  const removeFromCustomTerm = (courseId: string) => {
    setCustomTerm(customTerm.filter(c => c.id !== courseId));
    // Remove schedule entry for this course
    removeSchedule(getKey(courseId));
  };

  const validateCRN = (crn: string): boolean => /^\d{4,5}$/.test(crn);

  const hasTimeConflict = (day: string, start: string, end: string, excludeCourseId?: string): boolean => {
    const startMin = (s: string) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m;
    };
    return Object.entries(storeSchedules).some(([key, s]) => {
      const id = key.split(":").pop();
      if (!id || id === excludeCourseId) return false;
      const entry = s as CourseSchedule;
      if (entry.day !== day) return false;
      // Overlap check
      const a1 = startMin(start), a2 = startMin(end);
      const b1 = startMin(entry.start), b2 = startMin(entry.end);
      return Math.max(a1, b1) < Math.min(a2, b2);
    });
  };

  const posterRef = useRef<HTMLDivElement | null>(null);
  const exportScheduleAsJPEG = async () => {
    const html2canvas = (await import('html2canvas')).default;
    if (!posterRef.current) return;
    const canvas = await html2canvas(posterRef.current, {
      backgroundColor: '#0a0a0f',
      width: 1000,
      height: 1400,
      scale: 1,
      useCORS: true,
    });
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const filename = `schedule-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.jpeg`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  };

  const markCourseAsCompleted = (course: Course) => {
    // Show confirmation alert
    const confirmMessage = isArabic 
      ? `هل أنت متأكد من أنك تريد تمرير مقرر ${course.code} - ${course.nameAr}؟`
      : `Are you sure you want to mark ${course.code} - ${course.name} as completed?`;
    
    if (!confirm(confirmMessage)) {
      return; // User cancelled
    }

    // Remove from custom term if it's there
    setCustomTerm(customTerm.filter(c => c.id !== course.id));
    
    // Add to appropriate completed courses array based on course category
    if (majorData.universityRequirements.some(c => c.id === course.id)) {
      setCompletedUniversityCourses([...completedUniversityCourses, course.id]);
    } else if (majorData.sharedFirstYearCourses.some(c => c.id === course.id)) {
      setCompletedSharedCourses([...completedSharedCourses, course.id]);
    } else {
      setCompletedCourses([...completedCourses, course.id]);
    }
  };

  if (showQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-dark pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{isArabic ? majorData.nameAr : majorData.name}</h1>
            <p className="text-gray-400 text-lg">
              {isArabic ? "أجب على الأسئلة التالية لتخصيص خطتك الدراسية" : "Answer the following questions to customize your study plan"}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="mb-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{questionnaire[currentStep]?.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 0 && (
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setHasCompletedFirstYear(true)} className="px-8 py-3" variant={hasCompletedFirstYear === true ? "default" : "outline"}>
                        {isArabic ? "نعم" : "Yes"}
                      </Button>
                      <Button onClick={() => setHasCompletedFirstYear(false)} className="px-8 py-3" variant={hasCompletedFirstYear === false ? "default" : "outline"}>
                        {isArabic ? "لا" : "No"}
                      </Button>
                    </div>
                  )}

                  {currentStep === 1 && hasCompletedFirstYear === false && (
                    <div className="grid gap-3">
                      <div className="text-center mb-4 p-3 bg-blue-500/10 rounded-lg">
                        <p className="text-blue-400 text-sm">{isArabic ? "متطلبات الجامعة - السنة الأولى المشتركة" : "University Requirements - Common First Year"}</p>
                      </div>
                      {majorData.universityRequirements.map((course) => (
                        <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <input
                            type="checkbox"
                            id={course.id}
                            checked={completedUniversityCourses.includes(course.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCompletedUniversityCourses([...completedUniversityCourses, course.id]);
                              } else {
                                setCompletedUniversityCourses(completedUniversityCourses.filter((id) => id !== course.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <label htmlFor={course.id} className="flex-1 cursor-pointer">
                            <span className="font-medium text-white">{course.code}</span>
                            <span className="text-gray-300 ml-2">{isArabic ? course.nameAr : course.name}</span>
                            <span className="text-cyan-400 ml-2">({course.credits} {isArabic ? getArabicHoursPlural(course.credits) : "credits"})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 1 && hasCompletedFirstYear === true && (
                    <div className="grid gap-3">
                      <div className="text-center mb-4 p-3 bg-green-500/10 rounded-lg">
                        <p className="text-green-400 text-sm">{isArabic ? "متطلبات الكلية المشتركة" : "Shared College Requirements"}</p>
                      </div>
                      {majorData.sharedFirstYearCourses.map((course) => (
                        <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <input
                            type="checkbox"
                            id={course.id}
                            checked={completedSharedCourses.includes(course.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCompletedSharedCourses([...completedSharedCourses, course.id]);
                              } else {
                                setCompletedSharedCourses(completedSharedCourses.filter((id) => id !== course.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <label htmlFor={course.id} className="flex-1 cursor-pointer">
                            <span className="font-medium text-white">{course.code}</span>
                            <span className="text-gray-300 ml-2">{isArabic ? course.nameAr : course.name}</span>
                            <span className="text-cyan-400 ml-2">({course.credits} {isArabic ? getArabicHoursPlural(course.credits) : "credits"})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-4">
                          <span className="text-3xl font-bold text-white">{completedSemesters}</span>
                        </div>
                        <p className="text-gray-400 mb-6">{isArabic ? "استخدم الأزرار أدناه" : "Use the buttons below"}</p>

                        {completedSemesters >= 3 && (
                          <div className="mb-6 p-4 bg-green-500/10 rounded-lg">
                            <p className="text-green-400 text-sm mb-2">{isArabic ? "المقررات التي ستعتبر مكتملة تلقائياً:" : "Courses that will be auto-completed:"}</p>
                            <div className="text-xs text-gray-300 space-y-1">
                              {Array.from({ length: completedSemesters - 2 }, (_, i) => i + 3).map((semester) => {
                                const semesterCourses = majorData.courses
                                  .filter((course) => course.semester === semester && course.type === "core")
                                  .map((course) => course.code);
                                return (
                                  <div key={semester} className="flex flex-wrap gap-1">
                                    <span className="font-medium text-blue-400">Semester {semester}:</span>
                                    <span>{semesterCourses.join(", ")}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <motion.button
                            key={num}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCompletedSemesters(num)}
                            className={`p-3 rounded-lg font-semibold transition-all ${
                              completedSemesters === num ? 'bg-gradient-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isArabic ? "السابق" : "Previous"}
            </Button>

            {currentStep < questionnaire.length - 1 ? (
              <Button
                onClick={() => {
                  if (currentStep === 0 && hasCompletedFirstYear === false) {
                    handleQuestionnaireSubmit();
                  } else if (currentStep === 0 && hasCompletedFirstYear === null) {
                    return;
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={currentStep === 0 && hasCompletedFirstYear === null}
              >
                {isArabic ? "التالي" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleQuestionnaireSubmit}>
                {isArabic ? "إنهاء" : "Finish"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      {/* Upper Stats Bar */}
      <div className="bg-black/30 border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">
              {isArabic ? majorData.nameAr : majorData.name}
            </h1>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isArabic ? "رجوع" : "Back"}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalCompletedCourses}</div>
              <div className="text-sm text-gray-400">{isArabic ? `${getArabicCoursesPlural(totalCompletedCourses)} مكتملة` : "Completed Courses"}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{completedCredits}</div>
              <div className="text-sm text-gray-400">{isArabic ? `${getArabicHoursPlural(completedCredits)} مكتملة` : "Completed Hours"}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{remainingCourses}</div>
              <div className="text-sm text-gray-400">{isArabic ? `${getArabicCoursesPlural(remainingCourses)} متبقية` : "Remaining Courses"}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{remainingCredits}</div>
              <div className="text-sm text-gray-400">{isArabic ? `${getArabicHoursPlural(remainingCredits)} متبقية` : "Remaining Hours"}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{completedSemesters}</div>
              <div className="text-sm text-gray-400">{isArabic ? "فصول مكتملة" : "Completed Semesters"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Courses Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                {isArabic ? "المقررات المتاحة للتسجيل" : "Courses Available for Registration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAvailableCourses().map(course => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center">
                      <div className="flex-1 [dir='rtl']:text-right">
                        <div className="font-semibold text-white">{course.code}</div>
                        <div className="text-gray-300 text-sm">
                          {isArabic ? course.nameAr : course.name}
                        </div>
                        <div className="text-cyan-400 text-xs mt-1">
                          {course.credits} {isArabic ? getArabicHoursPlural(course.credits) : "credits"} • {course.type}
                        </div>
                      </div>
                      <div className="ms-auto flex items-center gap-2 [dir='rtl']:flex-row-reverse">
                        <Button 
                          size="sm"
                          onClick={() => addToCustomTerm(course)}
                          disabled={customTerm.length >= 6}
                          title={isArabic ? "إضافة للفصل" : "Add to term"}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => markCourseAsCompleted(course)}
                          title={isArabic ? "تمرير المقرر" : "Mark as completed"}
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Term Builder Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-400" />
                {isArabic ? "منشئ الفصل المخصص" : "Custom Term Builder"}
                <span className="text-sm text-gray-400">
                  ({customTerm.length}/6)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customTerm.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    {isArabic ? "اختر المقررات من القائمة المجاورة" : "Select courses from the list to build your term"}
                  </div>
                ) : (
                  customTerm.map(course => {
                    const courseSchedule = getSchedule(course.id);
                    const conflict = hasTimeConflict(courseSchedule.day, courseSchedule.start, courseSchedule.end, course.id);
                    
                    // use global getCrnBorderClass helper

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-green-500/10 rounded-lg border border-green-500/30"
                      >
                        {/* Course Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="font-semibold text-white">{course.code}</div>
                            <div className="text-gray-300 text-sm">
                              {isArabic ? course.nameAr : course.name}
                            </div>
                            <div className="text-green-400 text-xs mt-1">
                              {course.credits} {isArabic ? getArabicHoursPlural(course.credits) : "credits"}
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCustomTerm(course.id)}
                            className="text-red-400 border-red-400/30 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Schedule Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Day Selection */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              {isArabic ? "اختر اليوم" : "Choose Day"}
                            </label>
                            <select
                              dir={isArabic ? 'rtl' : 'ltr'}
                              value={courseSchedule.day}
                              onChange={(e) => setScheduleField(course.id, 'day', e.target.value)}
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
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                dir={isArabic ? 'rtl' : 'ltr'}
                                value={courseSchedule.start}
                                onChange={(e) => setScheduleField(course.id, 'start', e.target.value)}
                                className={`w-full p-2 bg-black/30 border rounded-lg text-white text-sm focus:outline-none ${
                                  conflict ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-blue-500'
                                }`}
                              >
                                {startTimes.map((t) => (
                                  <option key={t} value={t} className="bg-black text-white">{t}</option>
                                ))}
                              </select>
                              <select
                                dir={isArabic ? 'rtl' : 'ltr'}
                                value={courseSchedule.end}
                                onChange={(e) => setScheduleField(course.id, 'end', e.target.value)}
                                className={`w-full p-2 bg-black/30 border rounded-lg text-white text-sm focus:outline-none ${
                                  conflict ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-blue-500'
                                }`}
                              >
                                <option value={endTimeForStart(courseSchedule.start)} className="bg-black text-white">
                                  {endTimeForStart(courseSchedule.start)}
                                </option>
                              </select>
                            </div>
                            {conflict && (
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
                                value={courseSchedule.crn}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                  setScheduleField(course.id, 'crn', value);
                                }}
                                placeholder="12345"
                                maxLength={5}
                                className={`w-full p-2 pl-10 bg-black/30 border rounded-lg text-white text-sm focus:outline-none ${getCrnBorderClass(courseSchedule.crn)}`}
                              />
                              {courseSchedule.crn && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  {validateCRN(courseSchedule.crn) ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-red-400" />
                                  )}
                                </div>
                              )}
                            </div>
                            {courseSchedule.crn && !validateCRN(courseSchedule.crn) && (
                              <div className="text-red-400 text-xs mt-1">
                                {isArabic ? "يجب أن يكون 4-5 أرقام" : "Must be 4-5 digits"}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                
                {customTerm.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {/* Summary */}
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className="text-sm text-gray-400">
                            {isArabic ? "إجمالي الساعات" : "Total Credits"}
                          </div>
                          <div className="text-2xl font-bold text-blue-400">
                            {customTerm.reduce((sum, course) => sum + course.credits, 0)}
                          </div>
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-sm text-gray-400">
                            {isArabic ? "الحالة" : "Status"}
                          </div>
                          {(() => {
                            const isReady = customTerm.every((course) => {
                              const s = getSchedule(course.id);
                              return s.day && s.start && s.end && validateCRN(s.crn);
                            });
                            let statusLabel: string;
                            if (isReady) {
                              statusLabel = isArabic ? "جاهز" : "Ready";
                            } else {
                              statusLabel = isArabic ? "غير مكتمل" : "Incomplete";
                            }
                            const statusClass = isReady ? 'text-green-400' : 'text-orange-400';
                            return <div className={`text-sm font-medium ${statusClass}`}>{statusLabel}</div>;
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="text-center">
                      {customTerm.map((course) => {
                        const s = getSchedule(course.id);
                        const missing = !(s.day && s.start && s.end && validateCRN(s.crn));
                        return missing ? (
                          <div key={`warn-${course.id}`} className="text-yellow-400 text-xs mb-1 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {isArabic ? 'أكمل اليوم والوقت و CRN لجميع المقررات' : 'Complete day, time, and CRN for all courses.'}
                          </div>
                        ) : null;
                      })}
                      {(() => {
                        const readyToExport = customTerm.every((course) => {
                          const s = getSchedule(course.id);
                          return s.day && s.start && s.end && validateCRN(s.crn);
                        });
                        let title: string | undefined;
                        if (!readyToExport) {
                          title = isArabic ? 'أكمل اليوم والوقت و CRN لجميع المقررات.' : 'Complete day, time, and CRN for all courses.';
                        }
                        return (
                          <Button
                            onClick={exportScheduleAsJPEG}
                            disabled={!readyToExport}
                            title={title}
                            className="bg-gradient-primary hover:bg-gradient-primary/80 disabled:opacity-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {isArabic ? "تصدير كصورة JPEG" : "Export as JPEG"}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Hidden poster for export */}
      <div style={{ position: 'absolute', left: -99999, top: -99999 }}>
        <div ref={posterRef}>
          <SchedulePoster
            isArabic={isArabic}
            dir={isArabic ? 'rtl' : 'ltr'}
            majorName={majorData.name}
            majorNameAr={majorData.nameAr}
            termName={undefined}
            totalCredits={customTerm.reduce((sum, c) => sum + c.credits, 0)}
            courses={customTerm}
            schedules={Object.fromEntries(customTerm.map((c) => [c.id, getSchedule(c.id)]))}
          />
        </div>
      </div>
    </div>
  );
}
