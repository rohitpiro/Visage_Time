import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import FaceDetection from '@/components/FaceDetection';
import { UserCheck, Clock, CalendarClock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveAttendanceRecord, subscribeToAttendance, type AttendanceRecord } from '@/utils/attendanceDB';

const Attendance = () => {
  const { currentUser } = useAuth();
  const [recognizedPerson, setRecognizedPerson] = useState<string | null>(null);
  const [attendanceTime, setAttendanceTime] = useState<string | null>(null);
  const [recentRecognitions, setRecentRecognitions] = useState<AttendanceRecord[]>([]);
  const [resetKey, setResetKey] = useState(0);
  
  useEffect(() => {
    const unsubscribe = subscribeToAttendance((records) => {
      setRecentRecognitions(records);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRecognition = async (personName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const attendeeName = currentUser?.name || personName;
    
    setRecognizedPerson(attendeeName);
    setAttendanceTime(timeString);
    
    try {
      await saveAttendanceRecord({
        name: attendeeName,
        time: timeString,
        date: dateString,
        userId: currentUser?.id || 'unknown'
      });

      toast({
        title: "Attendance Recorded",
        description: `${attendeeName} marked present at ${timeString}`,
      });
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save attendance record",
      });
    }

    setTimeout(() => {
      setRecognizedPerson(null);
      setAttendanceTime(null);
      setResetKey(prev => prev + 1);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">
          Use facial recognition to mark attendance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Face Recognition */}
        <Card>
          <CardHeader>
            <CardTitle>Face Recognition</CardTitle>
            <CardDescription>
              Stand in front of the camera to mark your attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <FaceDetection 
              key={resetKey}
              onRecognition={handleRecognition} 
              mode="recognize" 
            />
          </CardContent>
        </Card>

        {/* Recognition Result */}
        <Card>
          <CardHeader>
            <CardTitle>Recognition Result</CardTitle>
            <CardDescription>
              Current recognition status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recognizedPerson ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center">{recognizedPerson}</h2>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{attendanceTime}</span>
                </div>
                <div className="w-full max-w-xs text-center px-6 py-2 bg-green-50 text-green-700 rounded-full">
                  Attendance Recorded Successfully
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-52 text-muted-foreground">
                <CalendarClock className="w-12 h-12 mb-2 opacity-30" />
                <p>No recognition yet</p>
                <p className="text-sm">Stand in front of the camera</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Recognitions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
            <CardDescription>
              The latest attendance records from this device
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecognitions.length > 0 ? (
              <div className="divide-y">
                {recentRecognitions.map((record, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                        <span className="font-medium text-brand-700">{record.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{record.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {record.time}
                      </div>
                      <div>{record.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center py-6 text-muted-foreground">
                No recent attendance records
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
