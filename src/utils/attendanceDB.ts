
import { ref, push, onValue, set } from 'firebase/database';
import { db } from '@/lib/firebase';

export interface AttendanceRecord {
  name: string;
  time: string;
  date: string;
  userId: string;
  timestamp: number;
}

const attendanceRef = ref(db, 'attendance');

export const saveAttendanceRecord = async (record: Omit<AttendanceRecord, 'timestamp'>) => {
  const newRecord = {
    ...record,
    timestamp: Date.now(),
  };
  const newRecordRef = push(attendanceRef);
  await set(newRecordRef, newRecord);
};

export const subscribeToAttendance = (callback: (records: AttendanceRecord[]) => void) => {
  onValue(attendanceRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    // Convert object to array and sort by timestamp
    const records = Object.values(data) as AttendanceRecord[];
    records.sort((a, b) => b.timestamp - a.timestamp);
    
    // Return only the 5 most recent records
    callback(records.slice(0, 5));
  });
};

