import React, { useState, useRef, useEffect } from 'react';

interface PhotoBoothProps {
  savedPhotos: string[];
  onSavePhoto: (photoDataUrl: string) => void;
}

const PhotoBooth: React.FC<PhotoBoothProps> = ({ savedPhotos, onSavePhoto }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please ensure permissions are granted.");
      }
    };

    getCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if(!context) return;
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPhoto(dataUrl);
  };

  const handleSaveAndReset = () => {
    if(photo) {
        onSavePhoto(photo);
        setPhoto(null);
    }
  }
  
  const reset = () => {
    setPhoto(null);
  };

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-between p-4">
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transform -scale-x-100 ${photo ? 'hidden' : ''}`}></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        {photo && <img src={photo} alt="Captured" className="w-full h-full object-cover" />}
      </div>
      
      <div className="flex items-center space-x-4 my-3">
        {photo ? (
          <>
            <button onClick={reset} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500">Retake</button>
            <button onClick={handleSaveAndReset} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">Save Photo</button>
          </>
        ) : (
          <button onClick={takePhoto} className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-gray-500 hover:border-gray-400">
            <div className="w-12 h-12 bg-red-600 rounded-full"></div>
          </button>
        )}
      </div>

      <div className="w-full h-24 bg-gray-900/50 rounded-lg flex-shrink-0 p-2 flex items-center space-x-2 overflow-x-auto">
        {savedPhotos.length > 0 ? savedPhotos.map((p, index) => (
            <img key={index} src={p} alt={`Saved ${index}`} className="w-20 h-full object-cover rounded-md flex-shrink-0 cursor-pointer" onClick={() => setPhoto(p)} />
        )) : (
            <div className="w-full text-center text-gray-500 text-sm">Saved photos will appear here</div>
        )}
      </div>
    </div>
  );
};

export default PhotoBooth;
