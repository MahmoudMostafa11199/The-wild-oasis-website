'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="bg-slate-600 text-white p-2 px-4"
      onClick={() => setCount((c) => c + 1)}
    >
      {count}
    </button>
  );
}
