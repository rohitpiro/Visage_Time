
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as faceapi from 'face-api.js';
import { Loader2 } from 'lucide-react';

interface FaceDetectionProps {
  onCapture?: (imageData: string) => void;
  onRecognition?: (personName: string) => void;
  mode: 'register' | 'recognize';
  processing?: boolean;
}

const FaceDetection = ({ 
  onCapture, 
  onRecognition, 
  mode, 
  processing = false 
}: FaceDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const MODEL_URL = '/models';
        
        // Check if models are already loaded
        if (!modelsLoaded) {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
          ]);
        }
        
        setModelsLoaded(true);
        setLoadingModels(false);
        console.log('Face detection models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load face detection models. Please refresh and try again.');
        setLoadingModels(false);
      }
    };

    loadModels();
  }, [modelsLoaded]);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setStream(stream);
        setError(null);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please check permissions and try again.');
      }
    };

    if (modelsLoaded) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [modelsLoaded]);

  // Real face detection using face-api.js
  useEffect(() => {
    if (!isDetecting || !stream || !modelsLoaded || !videoRef.current) return;

    let detectInterval: number;
    
    const detectFaces = async () => {
      if (!videoRef.current) return;
      
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();
        
        const faceFound = detections.length > 0;
        setFaceDetected(faceFound);
        
        if (faceFound && mode === 'recognize' && onRecognition) {
          // In a real app, this would compare against stored face descriptors
          // For now, we'll just return the fact that a face was detected
          // You would typically have a backend API call here
          setTimeout(() => {
            onRecognition("Face Detected");
            setIsDetecting(false);
          }, 1500);
        }
      } catch (err) {
        console.error('Face detection error:', err);
      }
    };

    detectInterval = window.setInterval(detectFaces, 500);
    
    return () => {
      clearInterval(detectInterval);
    };
  }, [isDetecting, stream, mode, onRecognition, modelsLoaded]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !faceDetected) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to data URL (base64 encoded image)
    const imageData = canvas.toDataURL('image/png');

    if (onCapture) {
      onCapture(imageData);
    }

    setIsDetecting(false);
  };

  const startDetection = () => {
    if (!modelsLoaded) {
      setError('Face detection models not loaded yet. Please wait.');
      return;
    }
    
    setIsDetecting(true);
    setFaceDetected(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {loadingModels && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <Loader2 className="animate-spin h-8 w-8 text-brand-600 mb-2" />
            <p>Loading face detection models...</p>
          </div>
        </div>
      )}
      
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-black">
        {/* Outer border with animation when detecting */}
        <div className={cn(
          "absolute inset-0 rounded-lg",
          isDetecting && "border-2 border-yellow-400",
          faceDetected && "border-2 border-green-500"
        )}>
          {/* Animated scanning effect */}
          {isDetecting && (
            <div className="absolute inset-x-0 top-0 h-1 bg-brand-500 animate-face-scan" />
          )}
        </div>

        {/* Video preview */}
        {error ? (
          <div className="aspect-video flex items-center justify-center bg-gray-900 text-white p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Face detection indicator */}
        {isDetecting && (
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2",
            faceDetected ? "border-green-500" : "border-yellow-400"
          )}>
            {faceDetected && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse-ring"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Face Detected
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="flex space-x-2">
        {!isDetecting && !processing && (
          <Button 
            onClick={startDetection}
            className="bg-brand-600 hover:bg-brand-700"
            disabled={loadingModels}
          >
            {mode === 'register' ? 'Detect Face' : 'Start Recognition'}
          </Button>
        )}

        {mode === 'register' && faceDetected && !processing && (
          <Button onClick={handleCapture} variant="secondary">
            Capture
          </Button>
        )}

        {processing && (
          <Button disabled>
            Processing...
          </Button>
        )}
      </div>
    </div>
  );
};

export default FaceDetection;
