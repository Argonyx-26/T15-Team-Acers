/**
 * useLLMChat — React hook wrapping the LLM WebWorker.
 * Provides: load(), chat(), status, isGenerating, modelReady
 */
import { useRef, useState, useCallback, useEffect } from 'react';

export type LLMStatus = 'idle' | 'loading' | 'ready' | 'generating' | 'error';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface WorkerMsg {
  type: 'status' | 'token' | 'done' | 'error';
  status?: string;
  text?: string;
  delta?: string;
  full?: string;
  error?: string;
}

export function useLLMChat() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<LLMStatus>('idle');
  const [statusText, setStatusText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const streamCallbackRef = useRef<((delta: string, full: string) => void) | null>(null);
  const doneCallbackRef = useRef<((full: string) => void) | null>(null);

  // Initialize worker lazily
  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    const worker = new Worker(
      new URL('../workers/llm.worker.ts', import.meta.url),
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
      } else if (msg.type === 'token') {
        setStatus('generating');
        if (msg.delta && msg.full !== undefined) {
          streamCallbackRef.current?.(msg.delta, msg.full);
        }
      } else if (msg.type === 'done') {
        setStatus('ready');
        setIsGenerating(false);
        doneCallbackRef.current?.(msg.full ?? '');
      } else if (msg.type === 'error') {
        setStatus('error');
        setStatusText(msg.error ?? 'Unknown error');
        setIsGenerating(false);
      }
    });

    workerRef.current = worker;
    return worker;
  }, []);

  /** Load the model — call once on mount */
  const load = useCallback(() => {
    const worker = ensureWorker();
    worker.postMessage({ type: 'load' });
  }, [ensureWorker]);

  /**
   * Generate a response for a conversation.
   * @param messages Full chat history including system prompt
   * @param onToken  Called for each streaming token
   * @param onDone   Called with final text when generation completes
   * @param maxTokens Max tokens to generate (default 400)
   */
  const chat = useCallback(
    (
      messages: ChatMessage[],
      onToken: (delta: string, full: string) => void,
      onDone: (full: string) => void,
      maxTokens = 400
    ) => {
      const worker = ensureWorker();
      streamCallbackRef.current = onToken;
      doneCallbackRef.current = onDone;
      setIsGenerating(true);
      setStatus('generating');
      worker.postMessage({ type: 'generate', messages, maxTokens });
    },
    [ensureWorker]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { load, chat, status, statusText, isGenerating, modelReady };
}
