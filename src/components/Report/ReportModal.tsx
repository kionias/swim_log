import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { X, Download, Loader2, MapPin, Waves, Quote, Sparkles } from 'lucide-react';
import { WorkoutWithDetails } from '../../types/database';
import { formatKoreanDate } from '../../utils/date';
import { formatDistance } from '../../utils/distance';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  workouts: WorkoutWithDetails[];
  downloadOnly?: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  workouts,
  downloadOnly = false,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const hiddenExportRef = useRef<HTMLDivElement>(null);
  const autoDownloadStarted = useRef(false);
  const [downloading, setDownloading] = useState(false);

  const allSets = workouts.flatMap((w) => w.sets || []);
  const totalDistance = workouts.reduce((sum, workout) => sum + (workout.total_distance || 0), 0);
  const primaryPool = workouts[0]?.pool?.name || '수영장';
  const primaryClass = workouts[0]?.class?.name || '자유수영';
  const quote = workouts.find((w) => w.quote)?.quote || '오늘의 한 바퀴가 내일의 실력을 만든다.';

  const handleDownload = async () => {
    const exportElement = hiddenExportRef.current || reportRef.current;
    if (!exportElement) return;

    try {
      setDownloading(true);

      // Ensure fonts are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 150));

      let dataUrl = '';
      try {
        // Primary attempt: html-to-image with 3x pixel ratio
        dataUrl = await toPng(exportElement, {
          pixelRatio: 3,
          cacheBust: true,
          quality: 1.0,
        });
      } catch (err) {
        console.warn('html-to-image fallback to html2canvas', err);
        // Fallback: html2canvas with scale 3
        const canvas = await html2canvas(exportElement, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
        });
        dataUrl = canvas.toDataURL('image/png', 1.0);
      }

      const link = document.createElement('a');
      const safeClassName = primaryClass.replace(/[\\/:*?"<>|]/g, '-');
      link.download = `SWIM_LOG_${safeClassName}_${dateStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG report', err);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !downloadOnly || autoDownloadStarted.current) return;
    autoDownloadStarted.current = true;
    void handleDownload().then(onClose);
  }, [isOpen, downloadOnly]);

  if (!isOpen) return null;

  const renderCardContent = (isExport: boolean) => (
    <div
      className={`relative mx-auto overflow-hidden bg-gradient-to-b from-ocean-900 via-ocean-800 to-slate-900 text-slate-800 shadow-2xl ${
        isExport ? 'w-[800px] rounded-3xl p-10' : 'w-full max-w-[760px] rounded-2xl p-5 sm:p-8'
      }`}
      style={{
        backgroundImage: "url('/image/background_01.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Background Overlays for Text Legibility */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-ocean-950/90 via-ocean-900/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950/90 via-slate-900/70 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ocean-500 text-white font-black text-xs">
                SL
              </div>
              <span className="text-xl font-black tracking-wider text-white">SWIM LOG</span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ocean-200">
              SWIMMING WORKOUT REPORT
            </p>
          </div>
          <div className="text-right">
            <span className="rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-extrabold tracking-wider text-white backdrop-blur-md">
              {formatKoreanDate(dateStr, true)}
            </span>
          </div>
        </div>

        {/* Info Grid (Pool & Class) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/20 bg-white/80 p-3.5 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ocean-700">
              <MapPin className="h-3.5 w-3.5 text-ocean-600" />
              <span>장소</span>
            </div>
            <p className="mt-1 text-sm sm:text-base font-black text-slate-900 truncate">
              {primaryPool}
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/80 p-3.5 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ocean-700">
              <Waves className="h-3.5 w-3.5 text-ocean-600" />
              <span>수업명</span>
            </div>
            <p className="mt-1 text-sm sm:text-base font-black text-slate-900 truncate">
              {primaryClass}
            </p>
          </div>
        </div>

        {/* Total Distance Hero Banner */}
        <div className="rounded-2xl border border-white/30 bg-gradient-to-r from-ocean-600/90 to-cyan-600/90 p-5 text-white shadow-lg backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-ocean-100">
                TOTAL DISTANCE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
                {formatDistance(totalDistance)}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-ocean-100 block">총 세트</span>
              <span className="text-2xl font-black text-white">{allSets.length}개</span>
            </div>
          </div>
        </div>

        {/* Workout Sets Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-700">
            <span>WORKOUT SETS</span>
            <span>1바퀴 = 25m × 2 = 50m</span>
          </div>

          <div className="grid grid-cols-[48px_minmax(0,1fr)_90px] items-center bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-200/60">
            <div className="text-center">순서</div>
            <div>운동 세트 내용</div>
            <div className="text-right">거리</div>
          </div>

          <div className="divide-y divide-slate-100">
            {allSets.map((set, idx) => (
              <div
                key={`${set.workout_id}-${set.sequence}-${idx}`}
                className="grid grid-cols-[48px_minmax(0,1fr)_90px] items-center px-4 py-2.5 text-xs sm:text-sm"
              >
                <div className="text-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ocean-50 text-[11px] font-black text-ocean-700">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-slate-800 break-words">
                    {set.description || '운동 내용 미입력'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-ocean-700">
                    {formatDistance(set.distance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Footer */}
        {quote && (
          <div className="rounded-2xl border border-white/30 bg-white/90 p-4 sm:p-5 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ocean-700">
              <Quote className="h-4 w-4 text-ocean-600" />
              <span>오늘의 수영 한마디</span>
            </div>
            <p className="mt-2.5 text-sm sm:text-base font-bold italic leading-relaxed text-slate-800">
              “{quote}”
            </p>
            <div className="mt-3 text-right">
              <span className="text-xs font-black text-ocean-600 tracking-wider">
                SwimBetter Today ✨
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Off-screen hidden fixed target container for pristine 3x PNG export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <div ref={hiddenExportRef}>{renderCardContent(true)}</div>
      </div>

      {/* Screen Modal Preview */}
      <div
        className={`${
          downloadOnly
            ? 'pointer-events-none fixed -left-[10000px] top-0 opacity-0'
            : 'fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/70 p-2 pt-16 backdrop-blur-sm sm:p-4 sm:pt-20'
        }`}
      >
        <div className="my-2 flex max-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:my-4">
          <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <Sparkles className="h-4 w-4 text-ocean-600" />
              <span>운동 리포트 카드 미리보기</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-ocean-600/20 transition hover:bg-ocean-700 disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{downloading ? '고해상도 생성 중...' : 'PNG 다운로드'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-6" ref={reportRef}>
            {renderCardContent(false)}
          </div>
        </div>
      </div>
    </>
  );
};

