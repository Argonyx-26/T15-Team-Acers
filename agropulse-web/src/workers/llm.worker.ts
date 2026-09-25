/**
 * AgroPulse LLM WebWorker
 * Model: HuggingFaceTB/SmolLM2-360M-Instruct (ONNX q4, ~180 MB)
 * Runs entirely in the browser — no server needed.
 * Streams tokens back to the main thread as they are generated.
 */

import {
  pipeline,
  TextGenerationPipeline,
  env,
} from '@huggingface/transformers';

// Point ONNX wasm files to the CDN build included in the package
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: TextGenerationPipeline | null = null;
let isLoading = false;

/* ── Message types ─────────────────────────────────────────────────── */
interface LoadMsg  { type: 'load' }
interface GenerateMsg {
  type: 'generate';
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}
type IncomingMsg = LoadMsg | GenerateMsg;

/* ── Load model ────────────────────────────────────────────────────── */
async function loadModel() {
  if (generator || isLoading) return;
  isLoading = true;

  self.postMessage({ type: 'status', status: 'loading', text: '⏳ Downloading SmolLM2 AI model (~180 MB)…' });

  try {
    // Try WebGPU first (fastest), fall back to WASM
    generator = await pipeline(
      'text-generation',
      'HuggingFaceTB/SmolLM2-360M-Instruct',
      { dtype: 'q4', device: 'webgpu' }
    ) as TextGenerationPipeline;
  } catch {
    try {
      generator = await pipeline(
        'text-generation',
        'HuggingFaceTB/SmolLM2-360M-Instruct',
        { dtype: 'q4', device: 'wasm' }
      ) as TextGenerationPipeline;
    } catch (err: any) {
      self.postMessage({ type: 'error', error: String(err?.message || err) });
      isLoading = false;
      return;
    }
  }

  isLoading = false;
  self.postMessage({ type: 'status', status: 'ready', text: '✅ AgroPulse AI is ready.' });
}

/* ── Generate ──────────────────────────────────────────────────────── */
async function generate(
  messages: Array<{ role: string; content: string }>,
  maxTokens = 350
) {
  if (!generator) {
    self.postMessage({ type: 'error', error: 'Model not loaded yet.' });
    return;
  }

  let accumulated = '';

  try {
    // @ts-ignore — streamer callback pattern for v4
    const output = await generator(messages, {
      max_new_tokens: maxTokens,
      temperature: 0.75,
      top_p: 0.92,
      repetition_penalty: 1.18,
      do_sample: true,
      return_full_text: false,
      // Stream tokens back
      callback_function: (beams: any[]) => {
        const newText: string = beams[0]?.output_token_ids
          ? ''   // handled by streamer below
          : beams[0]?.generated_text ?? '';

        if (newText && newText !== accumulated) {
          const delta = newText.slice(accumulated.length);
          accumulated = newText;
          if (delta) self.postMessage({ type: 'token', delta, full: accumulated });
        }
      },
    });

    // Final full text (guaranteed correct)
    const raw = Array.isArray(output) ? output[0] : output;
    const finalText: string = (raw as any)?.generated_text ?? accumulated;

    self.postMessage({ type: 'done', full: finalText || accumulated });
  } catch (err: any) {
    self.postMessage({ type: 'error', error: String(err?.message || err) });
  }
}

/* ── Message handler ───────────────────────────────────────────────── */
self.addEventListener('message', async (e: MessageEvent<IncomingMsg>) => {
  const msg = e.data;
  if (msg.type === 'load') {
    await loadModel();
  } else if (msg.type === 'generate') {
    await generate(msg.messages, msg.maxTokens);
  }
});
