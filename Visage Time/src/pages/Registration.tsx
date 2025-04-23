
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import FaceDetection from '@/components/FaceDetection';
import { useAuth } from '@/contexts/AuthContext';

// In a real app, this interface would match your backend API
interface EmployeeRegistration {
  name: string;
  employeeId: string;
  department: string;
  faceImage: string;
}

const Registration = () => {
  const { isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !employeeId || !department) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!capturedImage) {
      toast({
        variant: "destructive",
        title: "Face capture required",
        description: "Please capture a face image for registration",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to your backend
      const registrationData: EmployeeRegistration = {
        name,
        employeeId,
        department,
        faceImage: capturedImage
      };
      
      // For now, we'll store in localStorage as a simple persistence
      const existingData = localStorage.getItem('registeredEmployees');
      const employees = existingData ? JSON.parse(existingData) : [];
      
      // Check if employee ID already exists
      if (employees.some((emp: EmployeeRegistration) => emp.employeeId === employeeId)) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "An employee with this ID already exists",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add new registration
      employees.push(registrationData);
      localStorage.setItem('registeredEmployees', JSON.stringify(employees));
      
      toast({
        title: "Registration successful!",
        description: `${name} has been registered successfully.`,
      });
      
      setIsRegistered(true);
      
      // Reset form for next entry
      setTimeout(() => {
        setName('');
        setEmployeeId('');
        setDepartment('');
        setCapturedImage(null);
        setIsRegistered(false);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error registering the employee. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access the registration page.
            Only administrators can register new employees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Register New User</h1>
        <p className="text-muted-foreground">
          Add new users to the facial recognition system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the details of the person to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting || isRegistered}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="Enter employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isSubmitting || isRegistered}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Enter department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isSubmitting || isRegistered}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isRegistered || !capturedImage} 
              className="w-full bg-brand-600 hover:bg-brand-700"
            >
              {isSubmitting ? 'Registering...' : isRegistered ? 'Registered!' : 'Register User'}
            </Button>
          </CardFooter>
        </Card>

        {/* Face Detection */}
        <Card>
          <CardHeader>
            <CardTitle>Face Capture</CardTitle>
            <CardDescription>
              Capture a clear image of the user's face
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {capturedImage ? (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={capturedImage} 
                    alt="Captured face" 
                    className="max-w-full h-auto" 
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCapturedImage(null)}
                  disabled={isSubmitting || isRegistered}
                >
                  Retake
                </Button>
              </div>
            ) : (
              <FaceDetection 
                onCapture={handleCapture} 
                mode="register" 
                processing={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
