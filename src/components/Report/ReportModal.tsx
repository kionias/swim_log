import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Loader2, CalendarDays, MapPin, Waves, Quote, Sparkles } from 'lucide-react';
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

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, dateStr, workouts, downloadOnly = false }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const autoDownloadStarted = useRef(false);
  const [downloading, setDownloading] = useState(false);

  const allSets = workouts.flatMap((w) => w.sets || []);

  const totalDistance = workouts.reduce((sum, workout) => sum + (workout.total_distance || 0), 0);
  const primaryPool = workouts[0]?.pool?.name || '수영장';
  const primaryClass = workouts[0]?.class?.name || '자유수영';
  const quote = workouts.find((w) => w.quote)?.quote || '오늘의 한 바퀴가 내일의 실력을 만든다.';

  const handleDownload = async () => {
    if (!reportRef.current) return;
    const reportElement = reportRef.current;
    const originalWidth = reportElement.style.width;
    const originalMaxWidth = reportElement.style.maxWidth;
    const originalMinWidth = reportElement.style.minWidth;
    const originalPaddingRight = reportElement.style.paddingRight;
    const originalPaddingBottom = reportElement.style.paddingBottom;
    const originalBoxSizing = reportElement.style.boxSizing;
    try {
      setDownloading(true);
      // Export at the full desktop card width even when the modal is viewed on mobile.
      reportElement.style.width = '760px';
      reportElement.style.maxWidth = '760px';
      reportElement.style.minWidth = '760px';
      reportElement.style.paddingRight = '16px';
      reportElement.style.paddingBottom = '16px';
      reportElement.style.boxSizing = 'content-box';
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#dff8ff',
        width: reportElement.scrollWidth,
        height: reportElement.scrollHeight,
        windowWidth: reportElement.scrollWidth,
        windowHeight: reportElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeClassName = primaryClass.replace(/[\\/:*?"<>|]/g, '-');
      link.download = `${safeClassName}_${dateStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG report', err);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      reportElement.style.width = originalWidth;
      reportElement.style.maxWidth = originalMaxWidth;
      reportElement.style.minWidth = originalMinWidth;
      reportElement.style.paddingRight = originalPaddingRight;
      reportElement.style.paddingBottom = originalPaddingBottom;
      reportElement.style.boxSizing = originalBoxSizing;
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !downloadOnly || autoDownloadStarted.current) return;
    autoDownloadStarted.current = true;
    void handleDownload().then(onClose);
  }, [isOpen, downloadOnly]);

  if (!isOpen) return null;

  return (
    <div className={`${downloadOnly ? 'pointer-events-none fixed -left-[10000px] top-0 opacity-0' : 'fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/70 p-2 pt-20 backdrop-blur-sm sm:p-4 sm:pt-20'}`}>
      <div className="my-2 flex max-h-[calc(100vh-5.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:my-4">
        <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Sparkles className="h-4 w-4 text-ocean-600" />
            <span>운동 리포트 카드</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-ocean-600/20 transition hover:bg-ocean-700 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>{downloading ? '생성 중...' : 'PNG 저장'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-2 sm:p-4">
          <div
            ref={reportRef}
            className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-ocean-50 via-white to-slate-50 text-slate-800 shadow-lg"
            style={{
              backgroundImage: "url('/image/background_01.png')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-white/30" />
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-r from-ocean-700/75 via-ocean-600/65 to-ocean-500/55" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-ocean-100/50" />
            <div className="absolute right-0 top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 px-4 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div>
                  <div className="text-4xl font-black leading-[0.9] tracking-[-0.08em] text-white sm:text-[52px]">
                    오늘의
                  </div>
                  <div className="mt-2 text-4xl font-black leading-[0.9] tracking-[-0.08em] text-white sm:text-[52px]">
                    수영 기록
                  </div>
                </div>
                <div className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-black text-white sm:mt-4 sm:px-4 sm:text-lg">
                  오늘도 수고했어! :)
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/40 bg-white/10 p-3 sm:mt-8 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 shadow-xs sm:px-4">
                    <div className="flex items-center gap-2 text-base font-bold text-ocean-700 sm:text-lg">
                      <CalendarDays className="w-5 h-5" />
                      <span>날짜</span>
                    </div>
                    <div className="mt-2 break-words text-base font-extrabold text-slate-800 sm:mt-3 sm:text-lg">
                      {formatKoreanDate(dateStr, true)}
                    </div>
                  </div>
                  <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 shadow-xs sm:px-4">
                    <div className="flex items-center gap-2 text-base font-bold text-ocean-700 sm:text-lg">
                      <MapPin className="w-5 h-5" />
                      <span>장소</span>
                    </div>
                    <div className="mt-2 break-words text-base font-extrabold text-slate-800 sm:mt-3 sm:text-lg">{primaryPool}</div>
                  </div>
                  <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 shadow-xs sm:px-4">
                    <div className="flex items-center gap-2 text-base font-bold text-ocean-700 sm:text-lg">
                      <Waves className="w-5 h-5" />
                      <span>수업명</span>
                    </div>
                    <div className="mt-2 break-words text-base font-extrabold text-slate-800 sm:mt-3 sm:text-lg">{primaryClass}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs sm:mt-8">
                <div className="flex flex-col gap-1 bg-ocean-600 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                  <div className="text-xl font-black tracking-[-0.04em] sm:text-2xl">운동 기록</div>
                  <div className="text-sm font-bold text-ocean-100 sm:text-base">1바퀴 = 25m × 2 = 50m</div>
                </div>

                <div className="grid grid-cols-[42px_minmax(0,1fr)_76px] items-center bg-ocean-50 px-3 py-3 text-xs font-extrabold text-ocean-800 sm:grid-cols-[60px_minmax(0,1fr)_110px] sm:px-4 sm:text-sm">
                  <div>순서</div>
                  <div>세트</div>
                  <div className="text-right">거리(m)</div>
                </div>

                <div>
                  {allSets.map((set, index) => (
                    <div
                      key={`${set.workout_id}-${set.sequence}-${index}`}
                      className="grid grid-cols-[42px_minmax(0,1fr)_76px] items-start border-t border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 sm:grid-cols-[60px_minmax(0,1fr)_110px] sm:px-4 sm:text-base"
                    >
                      <div className="flex items-center justify-center">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ocean-100 text-xs font-black text-ocean-700 sm:h-9 sm:w-9 sm:text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 break-words pr-2">
                        <span className="font-bold text-slate-800">{set.description || '운동 내용 미입력'}</span>
                      </div>
                      <div className="text-right text-sm font-black text-ocean-700 sm:text-base">{formatDistance(set.distance).replace('m', '')}m</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-ocean-700 to-ocean-600 px-5 py-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-black sm:text-2xl">총 운동거리</div>
                    <div className="text-2xl font-black sm:text-3xl">{formatDistance(totalDistance)}</div>
                  </div>
                  <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white/90"
                      style={{ width: `${Math.min(100, (totalDistance / Math.max(1, totalDistance)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-xs sm:mt-8 sm:px-6 sm:py-5">
                <div className="flex items-center gap-2 text-xl font-black tracking-[-0.04em] text-slate-700 sm:gap-3 sm:text-2xl">
                  <Quote className="h-6 w-6 text-ocean-600 sm:h-8 sm:w-8" />
                  <span>오늘의 수영 한마디</span>
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 break-words text-xl font-black italic leading-tight tracking-[-0.05em] text-slate-800 sm:text-2xl">
                    “{quote}”
                  </div>
                  <div className="flex flex-col items-start text-left sm:items-end sm:text-right">
                    <div className="text-lg font-black text-ocean-600" style={{ letterSpacing: '-0.08em' }}>
                      Swim Better
                    </div>
                    <div className="text-lg font-black text-ocean-600" style={{ letterSpacing: '-0.08em' }}>
                      Today ✨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

