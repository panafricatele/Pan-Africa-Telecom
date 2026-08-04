import { useEffect, useRef, useState } from 'react';
import { Activity, Download, Gauge, MessageCircle, Upload, type LucideIcon } from 'lucide-react';
import { COMPANY, WHATSAPP_LINK } from '../lib/constants';

type TestState = 'idle' | 'testing' | 'done';

interface GaugeSize {
  width: number;
  height: number;
  dpr: number;
}

function drawGauge(canvas: HTMLCanvasElement, value: number, max: number, label: string, size: GaugeSize) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height, dpr } = size;

  // Reset transform and scale for crisp drawing
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height * 0.78;
  const r = Math.min(width, height * 1.35) / 2 - 24;

  const start = Math.PI * 0.8;
  const end = Math.PI * 2.2;
  const total = end - start;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, start, end);
  ctx.lineWidth = 22;
  ctx.strokeStyle = 'rgba(15,23,42,0.08)';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Active arc
  const pct = Math.min(value / max, 1);
  const gradient = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  gradient.addColorStop(0, '#10B981');
  gradient.addColorStop(0.5, '#0088FF');
  gradient.addColorStop(1, '#2563EB');

  ctx.beginPath();
  ctx.arc(cx, cy, r, start, start + pct * total);
  ctx.strokeStyle = gradient;
  ctx.stroke();

  // Needle
  const angle = start + pct * total;
  const nx = cx + (r - 10) * Math.cos(angle);
  const ny = cy + (r - 10) * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(nx, ny);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0F172A';
  ctx.stroke();

  // Hub
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();

  // Value text
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.font = '700 32px Inter, ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(`${Math.round(value)}`, cx, cy - 16);
  ctx.fillStyle = 'rgba(15,23,42,0.6)';
  ctx.font = '500 12px Inter, ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(label, cx, cy + 8);
}

function Stat({ label, value, icon: Icon, active }: { label: string; value: string; icon: LucideIcon; active?: boolean }) {
  return (
    <div className={`glass-card p-4 text-center ${active ? 'ring-1 ring-telecomBlue' : ''}`}>
      <Icon className={`mx-auto ${active ? 'text-telecomBlue' : 'text-slate-400'}`} size={20} />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export default function SpeedTestWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<GaugeSize>({ width: 0, height: 0, dpr: 1 });
  const statusRef = useRef<TestState>('idle');
  const downloadRef = useRef(0);

  const [status, setStatus] = useState<TestState>('idle');
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { downloadRef.current = download; }, [download]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGauge(canvas, statusRef.current === 'idle' ? 0 : downloadRef.current, 1000, 'Mbps', sizeRef.current);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      sizeRef.current = { width, height, dpr };
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    draw();
  }, [download, status]);

  const startTest = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setStatus('testing');
    setPing(0);
    setDownload(0);
    setUpload(0);

    const start = performance.now();
    const animate = () => {
      const t = performance.now() - start;

      if (t < 1000) {
        setPing(12 + Math.random() * 13);
        setDownload((t / 1000) * 120 + Math.random() * 30);
      } else if (t < 3000) {
        const progress = (t - 1000) / 2000;
        setDownload(120 + progress * 700 + Math.random() * 50);
      } else if (t < 5000) {
        const progress = (t - 3000) / 2000;
        setUpload(progress * 280 + Math.random() * 50);
        setDownload(820 + Math.random() * 130);
        setPing(Math.max(10, 14 + Math.sin(t / 200) * 6));
      } else {
        setPing(Math.round(10 + Math.random() * 14));
        setDownload(Math.round(250 + Math.random() * 700));
        setUpload(Math.round(80 + Math.random() * 250));
        setStatus('done');
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="speed" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass-card p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Live Speed Test Simulator</h2>
              <p className="mt-3 text-slate-600">
                Simulate a speed test to preview the line quality you can expect on our network.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <Stat label="Ping" value={`${Math.round(ping)} ms`} icon={Activity} active={status === 'testing'} />
                <Stat label="Download" value={`${Math.round(download)} Mbps`} icon={Download} active={status === 'testing'} />
                <Stat label="Upload" value={`${Math.round(upload)} Mbps`} icon={Upload} active={status === 'testing'} />
              </div>

              <button
                onClick={startTest}
                disabled={status === 'testing'}
                className="btn-primary mt-8 w-full sm:w-auto"
              >
                {status === 'testing' ? (
                  'Testing...'
                ) : (
                  <>
                    {status === 'done' ? 'Test Again' : 'Start Test'}
                    <Gauge size={18} />
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={COMPANY.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  Customer Portal
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  <MessageCircle size={16} /> WhatsApp Support
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="h-64 w-full max-w-sm"
                aria-label="Speed test gauge"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
