-- Generated from src/utils/mockData.ts.
-- Run once in the Supabase SQL Editor. The transaction rolls back completely on failure.
BEGIN;

DO $seed$
DECLARE
  v_pool_id UUID;
  v_class_1_id UUID;
  v_class_2_id UUID;
  v_workout_id UUID;
BEGIN
  INSERT INTO public.pools (name, location, length) VALUES ('용인시평생학습관스포츠센터', '경기도 용인시', 25) RETURNING id INTO v_pool_id;
  INSERT INTO public.classes (pool_id, name, days, start_time, end_time, description, is_active) VALUES (v_pool_id, '8시 연수반(월수금)', '월수금', '20:00', '21:00', '월/수/금 저녁 수영 연수반', true) RETURNING id INTO v_class_1_id;
  INSERT INTO public.classes (pool_id, name, days, start_time, end_time, description, is_active) VALUES (v_pool_id, '8시 연수반(화목)', '화목', '20:00', '21:00', '화/목 저녁 수영 연수반', true) RETURNING id INTO v_class_2_id;

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2025-08-26', 60, 950, '', '오늘도 수고하셨습니다! 꾸준함이 최고의 기록입니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 200, NULL, '웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 100, NULL, '자유형 오른팔 드릴 (갈 때 주먹쥐고, 올 때 펴고) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 100, NULL, '자유형 왼팔 드릴 (갈 때 주먹쥐고, 올 때 펴고) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 100, NULL, '자유형 (갈때 주먹쥐고, 올때 펴고) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 125, NULL, '자유형 대쉬 (2명출발) 2바퀴반');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 25, NULL, '걷기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 100, NULL, '접영 스케이트 드릴 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '접영 스케이트, 웨이브, 팔돌리기 드릴 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '접영 (호흡 3스트로크당 1번) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 50, NULL, '접영 (호흡 2스트로크당 1번) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 50, NULL, '접영 대쉬 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-08-27', 60, 850, '', '꾸준한 연습이 더 좋은 수영 실력으로 이어집니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 200, NULL, '웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 100, NULL, '평영 발차기 (발을 무릎 넓이로 벌린 후 11자로 엉덩이에 발을 붙이고 발차기) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 100, NULL, '평영 발차기 (한쪽 발씩 번갈아 차기) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '평영 발차기 2번 · 풀 1번 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 100, NULL, '평영 발차기 1번 · 풀 1번 · 발차기 1번 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 100, NULL, '자유형 발차기 · 평영 풀 / 접영 발차기 · 평영 풀 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 200, NULL, 'IM 4바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-08-28', 60, 1450, '', '꾸준한 연습이 더 좋은 수영 실력으로 이어집니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업(자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업(배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업(평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 200, NULL, '자유형 (캐치 드릴) 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 500, NULL, '자유형 10바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 100, NULL, '배영 (캐치업 드릴) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 200, NULL, '배영, 평영 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 100, NULL, '접영(자유형 발차기, 갈 때는 헤드업) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 50, NULL, '접영(대쉬) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 50, NULL, '다운 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-08-31', 60, 1900, '', '꾸준함이 최고의 기록입니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업(자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업(배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업(평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 150, NULL, '자유형 발차기 사이드 킥 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 150, NULL, '접영 발차기 사이드 킥 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 150, NULL, '바사로 킥 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 200, NULL, '자유형 (3번째 드릴 시 팔 입수동작 유지) 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '접영 (한팔접영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 100, NULL, '배영 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 150, NULL, '평영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 12, 200, NULL, '자유형 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 13, 200, NULL, '접영 (한팔접영) 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 14, 150, NULL, '배영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 15, 100, NULL, '평영 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 16, 50, NULL, '자유형 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-01', 60, 1625, '', '꾸준한 연습이 더 좋은 수영 실력으로 이어집니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 200, NULL, '웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 100, NULL, '자유형 발차기 (약한쪽은 오리발 벗고, 강한쪽은 발차기 말고 띄어 놓기) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 100, NULL, '자유형 발차기 (약한쪽은 오리발 벗고, 강한쪽은 약한쪽에 맞추어) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '접영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 50, NULL, '배영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 250, NULL, '자유형 인터벌 (1분) 1바퀴 × 5');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 250, NULL, '자유형 인터벌 (1분, 3스트로크당 오른쪽 왼쪽 번갈아 가며 호흡) 1바퀴 × 5');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 25, NULL, '걷기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 600, NULL, '자유형 인터벌 (1분 30초) 1.5바퀴 × 8 (1.5바퀴 = 75m)');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-02', 60, 1025, '', '수영은 속도가 아니라, 멈추지 않는 마음이 결과를 만듭니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업 (자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 150, NULL, '풀부이 끼고 상단 스컬링, 자유형 드릴, 풀부이 접고 자유형 발차기 1.5바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 150, NULL, '풀부이 끼고 중단 스컬링, 평영 드릴, 풀부이 접고 평영 발차기 1.5바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 75, NULL, '풀부이 끼고 배영 스컬링, 배영 드릴, 풀부이 잡고 배영 발차기 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 150, NULL, '배영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 200, NULL, '평영, 자유형 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '접영 자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 50, NULL, '접영 대쉬 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-03', 60, 800, '', '물은 당신의 노력을 기억합니다. 꾸준함이 곧 실력이고, 실력이 곧 자신감입니다!') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 0, NULL, '오리발 착용');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 100, NULL, '원팔 차렷 자세, 오른팔 자유형 스트로크 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 100, NULL, '오른팔 차렷 자세, 왼팔 자유형 스트로크 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 25, NULL, '오른팔 자유형 스트로크 오른쪽 호흡 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 25, NULL, '왼팔 자유형 스트로크 오른쪽 호흡 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 50, NULL, '하이엘보 자유형 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 75, NULL, '접영, 자유형, 자유형 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 75, NULL, '배영, 자유형, 자유형 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 75, NULL, '평영, 자유형, 자유형 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 75, NULL, '자유형, 자유형, 자유형 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 50, NULL, '접영, 자유형 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 12, 50, NULL, '배영, 자유형 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 13, 50, NULL, '평영, 자유형 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 14, 50, NULL, '자유형, 자유형 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-04', 60, 1000, '', '수영은 속도를 겨루는 운동이 아니라, 나 자신을 이기는 과정입니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업(자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업(배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업(평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 100, NULL, '배영 롤링 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 100, NULL, '배영 발차기 6번당 드릴 1번씩 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 200, NULL, '배영 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 100, NULL, '평영 발차기 3번당 드릴 1번 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 150, NULL, '평영, 한팔 접영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 100, NULL, '접영 대쉬 2바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-07', 60, 1590, '', '조금 느려도 괜찮아, 멈추지 않는 것이 가장 빠른 길이야.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업(자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업(배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업(평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 0, NULL, '오리발 착용');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 200, NULL, '보드잡고 앞으로 나란히 자세로 자유형 발차기 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 50, NULL, '보드잡고 접영으로 접영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 100, NULL, '바사로 발차기 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 200, NULL, '자유형 손끝 물에 스치기 드릴 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 40, NULL, '걷기 20m × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 200, NULL, '자유형, IM 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 200, NULL, '접영, IM 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 12, 200, NULL, '배영, IM 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 13, 200, NULL, '평영, IM 4바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-08', 60, 1350, '', '지금의 한 번이 더 멀리 가기 위한 소중한 연습입니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 0, NULL, '오리발 착용');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 200, NULL, '웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 25, NULL, '킥보드 잡고 앞으로 나란히 자세로 접영 발차기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '킥보드 잡고 앞으로 나란히 자세로 배영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 75, NULL, '킥보드 잡고 앞으로 나란히 자세로 접영 발차기 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 100, NULL, '킥보드 잡고 앞으로 나란히 자세로 자유형 발차기 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 100, NULL, '킥보드 잡고 접영 발차기 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 75, NULL, '킥보드 잡고 배영 발차기 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '킥보드 잡고 접영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 25, NULL, '킥보드 잡고 자유형 발차기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 50, NULL, '접영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 12, 50, NULL, '배영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 13, 50, NULL, '평영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 14, 50, NULL, '자유형 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 15, 75, NULL, '접영 (갈 때 헤드업, 올 때 일반) 1.5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 16, 50, NULL, '배영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 17, 50, NULL, '평영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 18, 50, NULL, '자유형 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 19, 25, NULL, '걷기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 20, 50, NULL, '접영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 21, 50, NULL, '배영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 22, 50, NULL, '평영 (갈 때 헤드업, 올 때 일반) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 23, 50, NULL, '자유형 (갈 때 헤드업, 올 때 일반) 1바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-09', 60, 1040, '', '지금의 한 번이 더 멀리 가기 위한 소중한 연습입니다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업(자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업(배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업(평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 150, NULL, '갈 때 스컬링(상단 3번, 중단 3번, 하단 3번), 올 때 자유형 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 150, NULL, '갈 때 스컬링(상단 3번, 중단 3번, 하단 3번), 올 때 평영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 150, NULL, '갈 때 스컬링(상단 3번, 중단 3번, 하단 3번), 올 때 한팔 접영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 100, NULL, '배영 발차기 (고개를 뒤로 제껴서 물속에서 날숨 호흡) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 40, NULL, '걷기 20m × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 250, NULL, '접영 후입선출 (들어온 순서의 역순으로 출발) 5바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-10', 60, 1000, '', '지금의 한 번이 더 멋진 나를 만든다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 50, NULL, '자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '평영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '접영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '배영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 50, NULL, '배영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 300, NULL, '자유형 6바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 50, NULL, '발을 벽면 하단에 붙이고 스컬링으로 5초 버틴 후 접영 반바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '발을 벽면 중단에 붙이고 스컬링으로 5초 버틴 후 접영 반바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '발을 벽면 상단에 붙이고 스컬링으로 5초 버틴 후 접영 반바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 50, NULL, '풀부이 잡고 잠영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 50, NULL, '킥판 잡고 잠영 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 12, 100, NULL, '자유형 (잠영 발차기 8번, 7번, 6번, 5번) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 13, 100, NULL, '배영 2바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-11', 60, 1450, '', '지금의 노력이 내일의 실력이 됩니다!') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업 (자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 200, NULL, '자유형 6번 발차기 후 드릴 1번씩 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 200, NULL, '자유형 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 200, NULL, '배영 6번 발차기 후 드릴 1번씩 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 200, NULL, '배영 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 300, NULL, '평영 대쉬 1바퀴 × 6');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 100, NULL, '자유형 다운 2바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-14', 60, 1400, '', '꾸준함이 실력을 만든다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업 (자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 150, NULL, '오리발 착용 · 접영 발차기 (차렷자세) 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 200, NULL, '접영 발차기 (머리 위로 팔장끼고) 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 150, NULL, '접영 발차기 (사이드 킥) 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 150, NULL, '접영 발차기 (바사로 킥) 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 150, NULL, '한팔 접영 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 250, NULL, '접영 (갈때는 접영발차기, 올때는 자유형 발차기) 5바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 100, NULL, '배영 발차기 2바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-15', 60, 1750, '', '지금의 한 번이 더 멋진 나를 만든다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 200, NULL, '오리발 착용 · 웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 300, NULL, '헤드업 자유형 발차기 반바퀴 × 12');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 150, NULL, '바사로 발차기 + 사이드 접영 발차기 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 25, NULL, '걷기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 150, NULL, '접영 1바퀴 × 3');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 25, NULL, '걷기 반바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 900, NULL, '자유형 6바퀴 × 3 (※ 1바퀴 약 40~45초)');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-16', 60, 1600, '', '지금의 한 번이 더 멋진 나를 만든다.') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업 (자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '발차기 (접영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 50, NULL, '발차기 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 50, NULL, '발차기 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 50, NULL, '발차기 (자유형) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 750, NULL, '장거리 (자유형) 15바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 400, NULL, '인터벌 (자유형 1분10초) 8바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_2_id, v_pool_id, '2026-09-17', 60, 950, '', '포기하지 마세요. 지금도 충분히 잘하고 있어요!') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 200, NULL, '웜업 4바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '평영 드릴(천천히) + 자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '평영 드릴(천천히 벌렸다가 빨리 모으기) + 자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 50, NULL, '평영 드릴(천천히 벌렸다가 빨리 모으기) + 다리에 킥판 끼고 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 50, NULL, '평영 2드릴(물속 1번, 숨쉬기 1번) + 평영킥 1번 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 150, NULL, '평영 2드릴(물속 1번, 숨쉬기 1번) + 평영킥 1번 반바퀴 + 평영 1바퀴 × 2 (1.5바퀴 × 2)');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 50, NULL, '접영 드릴(천천히, 리커버리는 가슴쪽으로) + 자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 50, NULL, '접영 드릴(물을 밀면서, 리커버리는 가슴쪽으로) + 자유형 발차기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 300, NULL, '접영 6바퀴');

  INSERT INTO public.workouts (class_id, pool_id, workout_date, duration_minutes, total_distance, memo, quote) VALUES (v_class_1_id, v_pool_id, '2026-09-18', 60, 1250, '', '고통은 짧고, 성취감은 길다!') RETURNING id INTO v_workout_id;
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 1, 100, NULL, '웜업 (자유형) 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 2, 50, NULL, '웜업 (배영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 3, 50, NULL, '웜업 (평영) 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 4, 150, NULL, '배영 (손을 가슴에 모으고) 발차기 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 5, 150, NULL, '배영 (한팔은 머리위로 한팔은 앞으로 나란히) 발차기 3바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 6, 200, NULL, '배영 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 7, 50, NULL, '걷기 1바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 8, 100, NULL, '평영 (차렷자세) 발차기 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 9, 100, NULL, '평영 (누워서) 발차기 2바퀴');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 10, 200, NULL, '평영 2바퀴 × 2');
  INSERT INTO public.workout_sets (workout_id, sequence, distance, laps, description) VALUES (v_workout_id, 11, 100, NULL, '평영 반바퀴 × 4');
END;
$seed$;

COMMIT;

SELECT 'pools' AS table_name, count(*) AS row_count FROM public.pools
UNION ALL SELECT 'classes', count(*) FROM public.classes
UNION ALL SELECT 'workouts', count(*) FROM public.workouts
UNION ALL SELECT 'workout_sets', count(*) FROM public.workout_sets
ORDER BY table_name;
