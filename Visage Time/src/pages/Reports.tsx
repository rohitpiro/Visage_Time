
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

// Mock attendance data for the reports
const MOCK_ATTENDANCE_DATA = [
  { id: 1, name: 'John Smith', employeeId: 'EMP001', department: 'Engineering', date: '2023-06-12', status: 'Present', timeIn: '08:32 AM', timeOut: '05:45 PM' },
  { id: 2, name: 'Maria Garcia', employeeId: 'EMP002', department: 'Marketing', date: '2023-06-12', status: 'Present', timeIn: '08:45 AM', timeOut: '05:30 PM' },
  { id: 3, name: 'Wei Chen', employeeId: 'EMP003', department: 'Engineering', date: '2023-06-12', status: 'Present', timeIn: '09:01 AM', timeOut: '06:12 PM' },
  { id: 4, name: 'Aisha Patel', employeeId: 'EMP004', department: 'HR', date: '2023-06-12', status: 'Present', timeIn: '09:12 AM', timeOut: '05:50 PM' },
  { id: 5, name: 'Carlos Rodriguez', employeeId: 'EMP005', department: 'Sales', date: '2023-06-12', status: 'Absent', timeIn: '-', timeOut: '-' },
  { id: 6, name: 'Emma Wilson', employeeId: 'EMP006', department: 'Design', date: '2023-06-12', status: 'Present', timeIn: '08:59 AM', timeOut: '05:40 PM' },
  { id: 7, name: 'Michael Johnson', employeeId: 'EMP007', department: 'Finance', date: '2023-06-12', status: 'Late', timeIn: '10:15 AM', timeOut: '06:30 PM' },
  { id: 8, name: 'Sophia Lee', employeeId: 'EMP008', department: 'Engineering', date: '2023-06-12', status: 'Present', timeIn: '08:50 AM', timeOut: '05:55 PM' },
];

// Mock department summary
const DEPARTMENT_SUMMARY = [
  { department: 'Engineering', total: 15, present: 14, absent: 1, percentage: 93 },
  { department: 'Marketing', total: 8, present: 7, absent: 1, percentage: 88 },
  { department: 'HR', total: 5, present: 5, absent: 0, percentage: 100 },
  { department: 'Sales', total: 12, present: 9, absent: 3, percentage: 75 },
  { department: 'Design', total: 7, present: 7, absent: 0, percentage: 100 },
  { department: 'Finance', total: 6, present: 5, absent: 1, percentage: 83 },
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter attendance data based on search query and filters
  const filteredData = MOCK_ATTENDANCE_DATA.filter(record => {
    // Search filter
    const matchesSearch = 
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Department filter
    const matchesDepartment = 
      departmentFilter === 'all' || record.department === departmentFilter;
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
        <p className="text-muted-foreground">
          View and analyze attendance data
        </p>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Report</TabsTrigger>
          <TabsTrigger value="department">Department Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          {/* Filters row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Attendance table */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Employee ID</th>
                      <th className="px-4 py-3 text-left font-medium">Department</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Time In</th>
                      <th className="px-4 py-3 text-left font-medium">Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((record) => (
                        <tr key={record.id} className="border-b last:border-0">
                          <td className="px-4 py-3 text-left">{record.name}</td>
                          <td className="px-4 py-3 text-left">{record.employeeId}</td>
                          <td className="px-4 py-3 text-left">{record.department}</td>
                          <td className="px-4 py-3 text-left">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'Present' ? 'bg-green-100 text-green-700' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-left">{record.timeIn}</td>
                          <td className="px-4 py-3 text-left">{record.timeOut}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                          No attendance records found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="department" className="space-y-4">
          {/* Department summary */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                placeholder="Search department..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="ml-2 gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Summary</CardTitle>
              <CardDescription>
                Attendance overview by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Department</th>
                      <th className="px-4 py-3 text-left font-medium">Total Staff</th>
                      <th className="px-4 py-3 text-left font-medium">Present</th>
                      <th className="px-4 py-3 text-left font-medium">Absent</th>
                      <th className="px-4 py-3 text-left font-medium">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEPARTMENT_SUMMARY
                      .filter(dept => 
                        dept.department.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((dept, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="px-4 py-3 text-left font-medium">{dept.department}</td>
                          <td className="px-4 py-3 text-left">{dept.total}</td>
                          <td className="px-4 py-3 text-left text-green-600">{dept.present}</td>
                          <td className="px-4 py-3 text-left text-red-600">{dept.absent}</td>
                          <td className="px-4 py-3 text-left">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                                <div 
                                  className="bg-brand-600 h-2.5 rounded-full" 
                                  style={{ width: `${dept.percentage}%` }}
                                ></div>
                              </div>
                              <span>{dept.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
