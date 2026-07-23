const RESPONSES = [
  "Signal locked. Based on the intel you've provided, here's my read:\n\n1. **Primary vector** — the situation resolves cleanly when approached from first principles.\n2. **Secondary considerations** — worth verifying assumptions before committing.\n3. **Recommendation** — proceed with staged confirmation.\n\nLet me know if you want me to expand on any of these.",
  "Understood. Here's a structured breakdown:\n\n- Objective: clarified.\n- Constraints: noted.\n- Approach: iterative with fallback.\n\n```ts\n// example\nfunction analyze(input: string) {\n  return input.trim().length > 0;\n}\n```\n\nStanding by for follow-up.",
  "All-seeing perspective engaged.\n\nThe short answer: **yes**, but with nuance. The longer answer requires unpacking three things — context, constraints, and consequences. Which do you want first?",
  "Recon complete. Nothing unusual on the horizon. Ask another.",
];

/**
 * Mock streaming generator. Yields text chunks with a small delay to simulate
 * token-by-token streaming. Used as fallback when NEXT_PUBLIC_API_URL is not set.
 */
export async function* streamMockResponse(
  _prompt: string,
  signal?: AbortSignal,
): AsyncGenerator<string, void, void> {
  const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
  // Preamble delay (radar sweep "thinking")
  await sleep(500 + Math.random() * 400, signal);

  // Tokenize by small chunks (1-3 chars) for a typing feel
  let i = 0;
  while (i < reply.length) {
    if (signal?.aborted) return;
    const chunkLen = Math.min(1 + Math.floor(Math.random() * 3), reply.length - i);
    yield reply.slice(i, i + chunkLen);
    i += chunkLen;
    await sleep(12 + Math.random() * 28, signal);
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('aborted', 'AbortError'));
    const t = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
