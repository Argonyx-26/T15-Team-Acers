/**
 * useVisionClassifier — React hook wrapping the vision WebWorker.
 * Provides: classify(), load(), status, isClassifying
 */
import { useRef, useState, useCallback, useEffect } from 'react';

export type VisionStatus = 'idle' | 'loading' | 'ready' | 'classifying' | 'error';

export interface VisionResult {
  targetClass: string;
  crop: string;
  disease: string;
  severity: string;
  confidence: number;
  rawLabel: string;
  isBug01?: boolean;
}

interface WorkerMsg {
  type: 'status' | 'classified' | 'error';
  status?: string;
  text?: string;
  result?: VisionResult;
  rawResults?: Array<{ label: string; score: number }>;
  error?: string;
}

export function useVisionClassifier() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<VisionStatus>('idle');
  const [statusText, setStatusText] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const callbackRef = useRef<((result: VisionResult) => void) | null>(null);

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    const worker = new Worker(
      new URL('../workers/vision.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.addEventListener('message', (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      if (msg.type === 'status') {
        if (msg.status === 'loading') {
          setStatus('loading');
          setStatusText(msg.text ?? '');
        } else if (msg.status === 'ready') {
          setStatus('ready');
          setModelReady(true);
          setStatusText(msg.text ?? '');
        }
      } else if (msg.type === 'classified') {
        setStatus('ready');
        setIsClassifying(false);
        if (msg.result) callbackRef.current?.(msg.result);
      } else if (msg.type === 'error') {
        setStatus('error');
        setStatusText(msg.error ?? 'Classification error');
        setIsClassifying(false);
      }
    });

    workerRef.current = worker;
    return worker;
  }, []);

  const load = useCallback(() => {
    const worker = ensureWorker();
    worker.postMessage({ type: 'load' });
  }, [ensureWorker]);

  const classify = useCallback(
    (imageData: string, onResult: (result: VisionResult) => void) => {
      const worker = ensureWorker();
      callbackRef.current = onResult;
      setIsClassifying(true);
      setStatus('classifying');
      worker.postMessage({ type: 'classify', imageData });
    },
    [ensureWorker]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { load, classify, status, statusText, isClassifying, modelReady };
}
