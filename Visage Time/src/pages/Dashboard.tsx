
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserCheck, 
  UserX, 
  UserPlus, 
  Clock, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AttendanceStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
  trend: number;
}

interface AttendanceRecord {
  name: string;
  time: string;
  date: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
    trend: 0
  });
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const loadDashboardData = async () => {
      try {
        // For now, we'll use localStorage data as a simple persistence mechanism
        const registeredEmployees = localStorage.getItem('registeredEmployees');
        const attendanceRecords = localStorage.getItem('attendanceRecords');
        
        // Get registered employees count
        const employees = registeredEmployees ? JSON.parse(registeredEmployees) : [];
        const records = attendanceRecords ? JSON.parse(attendanceRecords) : [];
        
        // Calculate totals
        const totalEmployees = employees.length;
        const presentEmployees = records.length;
        const absentEmployees = Math.max(0, totalEmployees - presentEmployees);
        const attendancePercentage = totalEmployees > 0 
          ? Math.round((presentEmployees / totalEmployees) * 100) 
          : 0;
          
        setStats({
          present: presentEmployees,
          absent: absentEmployees,
          total: totalEmployees || 10, // Default to 10 if no data
          percentage: attendancePercentage,
          trend: 0 // Would be calculated in a real app
        });
        
        setRecentAttendance(records);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome and time section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with attendance today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <Clock className="ml-2 h-4 w-4" />
          <span>
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground">
              {stats.percentage}% of total staff
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              {100 - stats.percentage}% of total staff
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.trend > 0 ? '+' : ''}{stats.trend}%
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Attendances</CardTitle>
          <CardDescription>
            The most recent check-ins recorded by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAttendance.length > 0 ? (
              recentAttendance.map((entry, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="font-medium text-brand-700">{entry.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {entry.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center py-6 text-muted-foreground">
                No recent attendance records
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
