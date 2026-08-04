import { useEffect, useState } from 'react';

export function useUptime(since: Date) {
  const [elapsed, setElapsed] = useState(Date.now() - since.getTime());

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - since.getTime()), 1000);
    return () => clearInterval(id);
  }, [since]);

  const seconds = Math.floor(elapsed / 1000) % 60;
  const minutes = Math.floor(elapsed / 60000) % 60;
  const hours = Math.floor(elapsed / 3600000) % 24;
  const days = Math.floor(elapsed / 86400000);

  return { days, hours, minutes, seconds };
}
