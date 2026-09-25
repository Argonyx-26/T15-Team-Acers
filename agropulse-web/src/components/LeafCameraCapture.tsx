import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  Zap,
  StopCircle
} from 'lucide-react';

export interface TestVectorSpecimen {
  id: string;
  name: string;
  crop: string;
  imageSrc: string;
  targetClass: string;
  isBug01?: boolean;
}

export const TEST_VECTORS: TestVectorSpecimen[] = [
  {
    id: 'rice-blb',
    name: 'Rice — Bacterial Leaf Blight',
    crop: 'Rice',
    imageSrc: '/test-vectors/rice_blb.jpg',
    targetClass: 'Rice___Bacterial_leaf_blight'
  },
  {
    id: 'rice-brown-spot',
    name: 'Rice — Brown Spot',
    crop: 'Rice',
    imageSrc: '/test-vectors/rice_brown_spot.jpg',
    targetClass: 'Rice___Brown_spot'
  },
  {
    id: 'rice-leaf-smut',
    name: 'Rice — Leaf Smut',
    crop: 'Rice',
    imageSrc: '/test-vectors/rice_leaf_smut.jpg',
    targetClass: 'Rice___Leaf_smut'
  },
  {
    id: 'tomato-early-blight',
    name: 'Tomato — Early Blight (Alternaria)',
    crop: 'Tomato',
    imageSrc: '/test-vectors/tomato_early_blight.jpg',
    targetClass: 'Tomato___Early_blight'
  },
  {
    id: 'tomato-late-blight',
    name: 'Tomato — Late Blight (Phytophthora)',
    crop: 'Tomato',
    imageSrc: '/test-vectors/tomato_late_blight.jpg',
    targetClass: 'Tomato___Late_blight'
  },
  {
    id: 'tomato-healthy',
    name: 'Tomato — Healthy Foliage',
    crop: 'Tomato',
    imageSrc: '/test-vectors/tomato_healthy.jpg',
    targetClass: 'Tomato___healthy'
  },
  {
    id: 'potato-late-blight',
    name: 'Potato — Late Blight',
    crop: 'Potato',
    imageSrc: '/test-vectors/potato_late_blight.jpg',
    targetClass: 'Potato___Late_blight'
  },
  {
    id: 'banana-sigatoka',
    name: 'Banana — Sigatoka Leaf Spot',
    crop: 'Banana',
    imageSrc: '/test-vectors/banana_sigatoka.jpg',
    targetClass: 'Banana___Sigatoka'
  },
  {
    id: 'banana-cordana',
    name: 'Banana — Cordana Leaf Spot',
    crop: 'Banana',
    imageSrc: '/test-vectors/banana_cordana.jpg',
    targetClass: 'Banana___Cordana'
  },
  {
    id: 'banana-healthy',
    name: 'Banana — Healthy Leaf',
    crop: 'Banana',
    imageSrc: '/test-vectors/banana_healthy.jpg',
    targetClass: 'Banana___healthy'
  },
  {
    id: 'sugarcane-redrot',
    name: 'Sugarcane — Red Rot',
    crop: 'Sugarcane',
    imageSrc: '/test-vectors/sugarcane_redrot.jpg',
    targetClass: 'Sugarcane___RedRot'
  },
  {
    id: 'sugarcane-rust',
    name: 'Sugarcane — Orange/Brown Rust',
    crop: 'Sugarcane',
    imageSrc: '/test-vectors/sugarcane_rust.jpg',
    targetClass: 'Sugarcane___Rust'
  },
  {
    id: 'sugarcane-healthy',
    name: 'Sugarcane — Healthy Foliage',
    crop: 'Sugarcane',
    imageSrc: '/test-vectors/sugarcane_healthy.jpg',
    targetClass: 'Sugarcane___Healthy'
  },
  {
    id: 'coconut-leafspot',
    name: 'Coconut — Grey Leaf Spot',
    crop: 'Coconut',
    imageSrc: '/test-vectors/coconut_leafspot.jpg',
    targetClass: 'Coconut___Leaf_Spot'
  },
  {
    id: 'desk-bug01',
    name: 'Desk Clutter (BUG-01 Guard)',
    crop: 'Non-Crop',
    imageSrc: '/test-vectors/desk_bug01.jpg',
    targetClass: 'Background_without_leaves',
    isBug01: true
  }
];

interface LeafCameraCaptureProps {
  onImageSelected: (imageSrc: string, selectedCrop: string, isFileUpload?: boolean) => void;
  isAnalyzing: boolean;
  detectedCrop: string;
  cropConfidence: number;
  cropVerification: 'VERIFIED_MATCH' | 'CROP_MISMATCH_DETECTED' | 'AUTO_DETECTED';
  mismatchWarning: string | null;
}

export const LeafCameraCapture: React.FC<LeafCameraCaptureProps> = ({
  onImageSelected,
  isAnalyzing,
  detectedCrop,
  cropConfidence,
  cropVerification,
  mismatchWarning
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Auto');
  const [imagePreview, setImagePreview] = useState<string>(TEST_VECTORS[0].imageSrc);
  const [activeVectorId, setActiveVectorId] = useState<string>(TEST_VECTORS[0].id);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start live webcam stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setCameraError('Webcam access was denied or is unavailable on this device. Use file upload or test vectors below.');
      setIsCameraActive(false);
    }
  };

  // Capture frame from webcam
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreview(dataUrl);
      setActiveVectorId('');
      stopCamera();
      onImageSelected(dataUrl, selectedCrop, true);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle custom image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImagePreview(src);
        setActiveVectorId('');
        stopCamera();
        onImageSelected(src, selectedCrop, true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger preset vector selection
  const handleSelectVector = (specimen: TestVectorSpecimen) => {
    stopCamera();
    setActiveVectorId(specimen.id);
    setImagePreview(specimen.imageSrc);
    onImageSelected(specimen.imageSrc, selectedCrop, false);
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-5 flex flex-col justify-between h-full shadow-lg">
      <div>
        {/* Box Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E95420]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Leaf Vision & Optical Capture
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#AEA79F] uppercase tracking-wider bg-[#141414] px-2 py-0.5 rounded border border-[#2E2E2E]">
            MobileNetV2 · 224×224 Float32
          </span>
        </div>

        {/* Viewfinder / Camera Area */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#111111] border border-[#2E2E2E] flex items-center justify-center group mb-4">
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={imagePreview}
              alt="Leaf Specimen"
              className="w-full h-full object-contain"
            />
          )}

          {/* Canonical Reticle Corners */}
          <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-[#E95420]/30 rounded-lg">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#E95420]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#E95420]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#E95420]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#E95420]" />
          </div>

          {/* Laser Scanning Animation when analyzing */}
          {isAnalyzing && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E95420] to-transparent shadow-[0_0_15px_#E95420] animate-[bounce_1.4s_infinite]" />
          )}

          {/* Viewfinder Overlay Pill */}
          <div className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono border border-[#2E2E2E] text-white flex items-center gap-1.5">
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3 h-3 text-[#E95420] animate-spin" />
                <span className="text-[#E95420] font-semibold">TFLite Inferring...</span>
              </>
            ) : isCameraActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#E95420] animate-ping" />
                <span>Live Viewfinder Active</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-[#E95420]" />
                <span>AI Auto-Targeting Armed</span>
              </>
            )}
          </div>
        </div>

        {/* Camera Error Message */}
        {cameraError && (
          <div className="mb-3 p-2.5 rounded bg-[#2A160F] border border-[#E95420]/50 text-[#FFB69B] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E95420] shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Capture / Upload Controls */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {isCameraActive ? (
            <>
              <button
                type="button"
                onClick={captureFrame}
                className="py-2.5 px-3 rounded-lg bg-[#E95420] hover:bg-[#FF6332] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Specimen</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="py-2.5 px-3 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2E2E2E] text-[#AEA79F] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <StopCircle className="w-4 h-4" />
                <span>Close Camera</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startCamera}
                className="py-2.5 px-3 rounded-lg bg-[#E95420] hover:bg-[#FF6332] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Open Live Camera</span>
              </button>

              <label className="py-2.5 px-3 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2E2E2E] text-[#E5E5E5] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                <Upload className="w-4 h-4 text-[#E95420]" />
                <span>Upload Leaf File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {/* Farmer Crop Selector (Optional Cross-Validation) */}
        <div className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-[#E95420] uppercase font-semibold flex items-center gap-1.5">
              <Sliders className="w-3 h-3" />
              <span>Farmer Crop Declaration (Cross-Validation)</span>
            </span>
            <span className="text-[10px] font-mono text-[#AEA79F]">
              {selectedCrop === 'Auto' ? 'Autonomous Detection' : `Selected: ${selectedCrop}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Auto', 'Rice', 'Banana', 'Sugarcane', 'Coconut', 'Tomato', 'Potato'].map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => {
                  setSelectedCrop(crop);
                  onImageSelected(imagePreview, crop, false);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  selectedCrop === crop
                    ? 'bg-[#E95420] text-white font-bold shadow-sm'
                    : 'bg-[#1E1E1E] text-[#AEA79F] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                {crop === 'Auto' ? '★ Auto-Detect' : crop}
              </button>
            ))}
          </div>
        </div>

        {/* Mismatch Warning Alert if detected */}
        {mismatchWarning && (
          <div className="mb-4 p-3 rounded-lg bg-[#2A160F] border border-[#E95420]/60 text-[#FFB69B] text-xs flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-[#E95420] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#E95420] block mb-0.5">Crop Morphology Mismatch Alert:</span>
              {mismatchWarning}
            </div>
          </div>
        )}
      </div>

      {/* Quick Test Vector Presets Grid */}
      <div className="pt-3 border-t border-[#2E2E2E]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-[#AEA79F] uppercase tracking-wider font-semibold">
            Field Test Vectors & Stress Presets
          </span>
          <span className="text-[10px] font-mono text-[#888888]">Tap to evaluate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {TEST_VECTORS.map((v) => {
            const isSelected = activeVectorId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVector(v)}
                className={`p-2 rounded text-left border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#2A160F] border-[#E95420] text-white font-semibold'
                    : 'bg-[#141414] border-[#2E2E2E] text-[#CCCCCC] hover:border-[#444444]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#E95420] truncate">{v.crop}</span>
                  {v.isBug01 && (
                    <span className="text-[8px] font-mono px-1 rounded bg-[#E95420] text-white font-bold">
                      BUG-01
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#E5E5E5] line-clamp-1">{v.name.split('—')[1] || v.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
