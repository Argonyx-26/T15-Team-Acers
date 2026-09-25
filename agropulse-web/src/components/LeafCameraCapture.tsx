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
  StopCircle,
  Brain,
  ScanLine,
  SwitchCamera,
} from 'lucide-react';
import { useVisionClassifier } from '../hooks/useVisionClassifier';

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
  onVisionResult?: (targetClass: string, crop: string, confidence: number, isBug01?: boolean) => void;
  isAnalyzing: boolean;
  detectedCrop: string;
  cropConfidence: number;
  cropVerification: 'VERIFIED_MATCH' | 'CROP_MISMATCH_DETECTED' | 'AUTO_DETECTED';
  mismatchWarning: string | null;
}

export const LeafCameraCapture: React.FC<LeafCameraCaptureProps> = ({
  onImageSelected,
  onVisionResult,
  isAnalyzing,
  detectedCrop,
  cropConfidence,
  cropVerification,
  mismatchWarning
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Auto');
  // Start blank — no pre-selected image until farmer uploads/captures
  const [imagePreview, setImagePreview] = useState<string>('');
  const [activeVectorId, setActiveVectorId] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [visionLabel, setVisionLabel] = useState<string>('');
  const [visionConfidence, setVisionConfidence] = useState<number>(0);
  const [inferenceSource, setInferenceSource] = useState<string>('');

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Vision AI hook — loads on demand
  const { classify, status: visionStatus, isClassifying } = useVisionClassifier();

  // Stop camera stream cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Attach stream to video element whenever camera becomes active or video mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch((err) => {
        console.warn('Video playback warning:', err);
      });
    }
  }, [isCameraActive]);

  // Start live webcam stream
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    try {
      let stream: MediaStream;
      try {
        // Try requested facing mode (ideal, non-strict to avoid OverconstrainedError on PCs)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (firstErr) {
        // Fallback for laptops/desktops with standard webcam
        console.warn('Environment facing failed, falling back to any camera:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);

      // Attach immediately if video element is already mounted
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraError('Webcam access was denied or is unavailable on this device. Please grant camera permission or use file upload.');
      setIsCameraActive(false);
    }
  };

  // Flip front/back camera
  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    await startCamera(nextFacing);
  };

  // Run autonomous classification on any image: data: URL or HTTP URL
  // Tries FastAPI backend first, then falls back to in-browser WebWorker
  const runClassification = async (dataOrSrc: string) => {
    // 1. Try FastAPI backend (port 8000)
    try {
      let blob: Blob;
      if (dataOrSrc.startsWith('data:')) {
        // data: URL (base64) — convert to blob
        const res = await fetch(dataOrSrc);
        blob = await res.blob();
      } else {
        // HTTP URL — fetch the image
        const res = await fetch(dataOrSrc);
        blob = await res.blob();
      }

      const formData = new FormData();
      formData.append('file', blob, 'leaf.jpg');
      if (selectedCrop !== 'Auto') {
        formData.append('user_crop', selectedCrop);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const resp = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timer);

      if (resp.ok) {
        const data = await resp.json();
        const conf = data.confidence_fraction ?? (data.confidence ? data.confidence / 100 : 0.95);
        const crop = data.detected_crop ?? (data.class_name ? data.class_name.split('___')[0] : 'Rice');
        const cond = data.condition_name ?? (data.class_name ? data.class_name.split('___')[1]?.replace(/_/g, ' ') : 'Diagnosis');
        const targetCls = data.class_name ?? 'Rice___Bacterial_leaf_blight';
        const isBug = data.status === 'REJECTED_NON_LEAF';

        setVisionLabel(`${crop}: ${cond}`);
        setVisionConfidence(conf);
        setInferenceSource('FastAPI Neural Engine (:8000)');

        if (onVisionResult) {
          onVisionResult(targetCls, crop, conf, isBug);
        }
        return;
      }
    } catch {
      // Backend not running or timed out → fall back to in-browser WebWorker
    }

    // 2. Browser MobileNetV2 Vision AI WebWorker
    setInferenceSource('MobileNetV2 Browser Vision');
    classify(dataOrSrc, (result) => {
      setVisionLabel(`${result.crop}: ${result.disease}`);
      setVisionConfidence(result.confidence);
      if (onVisionResult) {
        onVisionResult(result.targetClass, result.crop, result.confidence, result.isBug01);
      }
    });
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
      setVisionLabel('');
      stopCamera();
      onImageSelected(dataUrl, selectedCrop, true);
      runClassification(dataUrl);
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
        setVisionLabel('');
        stopCamera();
        onImageSelected(src, selectedCrop, true);
        runClassification(src);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger preset vector selection
  const handleSelectVector = (specimen: TestVectorSpecimen) => {
    stopCamera();
    setActiveVectorId(specimen.id);
    setImagePreview(specimen.imageSrc);
    setVisionLabel(`${specimen.crop}: ${specimen.name}`);
    setVisionConfidence(specimen.isBug01 ? 0.99 : 0.96);
    setInferenceSource('Preset Vector');
    onImageSelected(specimen.imageSrc, selectedCrop, false);
    if (onVisionResult) {
      onVisionResult(specimen.targetClass, specimen.crop, specimen.isBug01 ? 0.99 : 0.96, specimen.isBug01);
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl p-5 flex flex-col justify-between h-full shadow-lg">
      <div>
        {/* Box Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E95420]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Leaf Vision &amp; Optical Capture
            </h3>
          </div>
        </div>

        {/* Viewfinder / Camera Area */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#111111] border border-[#2E2E2E] flex items-center justify-center group mb-4">
          {isCameraActive ? (
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && streamRef.current && el.srcObject !== streamRef.current) {
                  el.srcObject = streamRef.current;
                  el.play().catch(() => {});
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : imagePreview ? (
            <img
              src={imagePreview}
              alt="Leaf Specimen"
              className="w-full h-full object-contain"
            />
          ) : (
            /* Landing state — no image yet */
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E95420]/10 border border-[#E95420]/30 flex items-center justify-center">
                <Upload className="w-7 h-7 text-[#E95420]/70" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">Upload a Leaf Image to Begin</div>
                <div className="text-xs text-[#666]">
                  Take a photo of your crop leaf or upload from your device.<br />
                  The AI will identify the disease and give you treatment advice.
                </div>
              </div>
            </div>
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

          {/* Vision AI classifying indicator */}
          {isClassifying && (
            <div className="absolute top-3 right-3 bg-[#111111]/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono border border-[#E95420]/40 text-[#E95420] flex items-center gap-1.5 animate-pulse">
              <Brain className="w-3 h-3" />
              <span>Vision AI running…</span>
            </div>
          )}

          {/* Vision result badge (shown after classification) */}
          {visionLabel && !isClassifying && (
            <div className="absolute bottom-3 left-3 right-3 bg-[#111111]/92 backdrop-blur-md px-3 py-2 rounded-lg border border-emerald-700/50 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <ScanLine className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[12px] font-mono text-emerald-300 font-bold leading-tight">{visionLabel}</div>
                  <div className="text-[9px] text-[#888] font-mono">{inferenceSource}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">{(visionConfidence * 100).toFixed(1)}%</span>
                <div className="text-[8px] text-[#666] uppercase">Confidence</div>
              </div>
            </div>
          )}
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
        <div className="mb-4">
          {isCameraActive ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={captureFrame}
                className="py-2.5 px-3 rounded-lg bg-[#E95420] hover:bg-[#FF6332] text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Snap</span>
              </button>

              <button
                type="button"
                onClick={toggleCameraFacing}
                title="Switch Camera (Front/Back)"
                className="py-2.5 px-3 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-[#AEA79F] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <SwitchCamera className="w-4 h-4 text-[#E95420]" />
                <span>Flip</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="py-2.5 px-3 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#2E2E2E] text-[#AEA79F] hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <StopCircle className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => startCamera()}
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
            </div>
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
    </div>
  );
};
