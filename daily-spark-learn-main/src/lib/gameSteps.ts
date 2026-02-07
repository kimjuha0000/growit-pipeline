 export interface GameStep {
   id: string;
   instruction: string;
   targetElement: string;
   action: "click" | "input" | "drag" | "toggle" | "select" | "slider";
   validation?: string;
   inputPlaceholder?: string;
   sliderConfig?: { min: number; max: number; default: number };
 }
 
 export interface DayGameConfig {
   day: number;
   title: string;
   subtitle: string;
   steps: GameStep[];
 }
 
 export const day1Steps: GameStep[] = [
   { id: "1-1", instruction: "툴바에서 '프레임 도구' 아이콘을 클릭하세요.", targetElement: "frame-tool", action: "click" },
   { id: "1-2", instruction: "드롭다운에서 '프레임'을 선택하세요.", targetElement: "frame-option", action: "click" },
   { id: "1-3", instruction: "속성 패널에서 'iPhone 14' 프리셋을 선택하세요.", targetElement: "iphone-preset", action: "click" },
   { id: "1-4", instruction: "레이어 이름을 '나의 첫 앱'으로 변경하세요.", targetElement: "layer-name", action: "input", inputPlaceholder: "나의 첫 앱" },
   { id: "1-5", instruction: "'확대' 버튼을 클릭하여 프레임을 확대하세요.", targetElement: "zoom-in", action: "click" },
   { id: "1-6", instruction: "캔버스에서 프레임을 선택하세요.", targetElement: "canvas-frame", action: "click" },
   { id: "1-7", instruction: "속성 패널에서 '채우기' 색상을 클릭하세요.", targetElement: "fill-color", action: "click" },
   { id: "1-8", instruction: "'파란색'을 선택하세요.", targetElement: "blue-color", action: "click" },
   { id: "1-9", instruction: "'콘텐츠 자르기' 체크박스를 토글하세요.", targetElement: "clip-content", action: "toggle" },
   { id: "1-10", instruction: "'완료' 버튼을 클릭하여 설정을 마무리하세요.", targetElement: "done-button", action: "click" },
 ];
 
 export const day2Steps: GameStep[] = [
   { id: "2-1", instruction: "툴바에서 '사각형 도구'를 선택하세요.", targetElement: "rect-tool", action: "click" },
   { id: "2-2", instruction: "캔버스에 사각형을 그리세요.", targetElement: "canvas-draw-rect", action: "click" },
   { id: "2-3", instruction: "툴바에서 '타원 도구'를 선택하세요.", targetElement: "ellipse-tool", action: "click" },
   { id: "2-4", instruction: "사각형 옆에 원을 그리세요.", targetElement: "canvas-draw-circle", action: "click" },
   { id: "2-5", instruction: "원의 색상을 빨간색으로 변경하세요.", targetElement: "red-color", action: "click" },
   { id: "2-6", instruction: "두 도형을 모두 선택하세요 (드래그 선택).", targetElement: "select-both", action: "click" },
   { id: "2-7", instruction: "'세로 중앙 정렬'을 클릭하세요.", targetElement: "align-vertical", action: "click" },
   { id: "2-8", instruction: "'가로 중앙 정렬'을 클릭하세요.", targetElement: "align-horizontal", action: "click" },
   { id: "2-9", instruction: "'그룹으로 묶기'를 클릭하세요.", targetElement: "group-button", action: "click" },
   { id: "2-10", instruction: "그룹 이름을 '로봇 얼굴'로 변경하세요.", targetElement: "group-name", action: "input", inputPlaceholder: "로봇 얼굴" },
 ];
 
 export const day3Steps: GameStep[] = [
   { id: "3-1", instruction: "툴바에서 '텍스트 도구'를 선택하세요.", targetElement: "text-tool", action: "click" },
   { id: "3-2", instruction: "캔버스를 클릭하여 텍스트 레이어를 만드세요.", targetElement: "canvas-text", action: "click" },
   { id: "3-3", instruction: "'안녕하세요'를 입력하세요.", targetElement: "text-input", action: "input", inputPlaceholder: "안녕하세요" },
   { id: "3-4", instruction: "텍스트 레이어를 선택하세요.", targetElement: "text-layer", action: "click" },
   { id: "3-5", instruction: "글꼴을 'Pretendard'로 변경하세요.", targetElement: "font-family", action: "click" },
   { id: "3-6", instruction: "굵기를 'Extra Bold'로 변경하세요.", targetElement: "font-weight", action: "click" },
   { id: "3-7", instruction: "크기를 48px로 변경하세요.", targetElement: "font-size", action: "click" },
   { id: "3-8", instruction: "텍스트 색상을 진한 회색으로 변경하세요.", targetElement: "text-color", action: "click" },
   { id: "3-9", instruction: "텍스트 정렬을 '가운데'로 설정하세요.", targetElement: "text-align", action: "click" },
   { id: "3-10", instruction: "자간을 -2%로 조정하세요.", targetElement: "letter-spacing", action: "slider", sliderConfig: { min: -5, max: 5, default: 0 } },
 ];
 
 export const day4Steps: GameStep[] = [
   { id: "4-1", instruction: "캔버스에서 사각형을 선택하세요.", targetElement: "select-rect", action: "click" },
   { id: "4-2", instruction: "'채우기' → '그라디언트(선형)'를 선택하세요.", targetElement: "gradient-fill", action: "click" },
   { id: "4-3", instruction: "그라디언트 방향을 조절하세요 (위→아래).", targetElement: "gradient-direction", action: "click" },
   { id: "4-4", instruction: "'선(Stroke)'을 추가하세요.", targetElement: "add-stroke", action: "click" },
   { id: "4-5", instruction: "선 색상을 흰색으로 설정하세요.", targetElement: "stroke-color", action: "click" },
   { id: "4-6", instruction: "선 두께를 4px로 설정하세요.", targetElement: "stroke-width", action: "click" },
   { id: "4-7", instruction: "선 위치를 '안쪽'으로 설정하세요.", targetElement: "stroke-inside", action: "click" },
   { id: "4-8", instruction: "'효과' → '드롭 섀도우'를 추가하세요.", targetElement: "drop-shadow", action: "click" },
   { id: "4-9", instruction: "그림자 블러를 20으로 설정하세요.", targetElement: "shadow-blur", action: "slider", sliderConfig: { min: 0, max: 50, default: 10 } },
   { id: "4-10", instruction: "모서리 반경을 16px로 설정하세요.", targetElement: "corner-radius", action: "slider", sliderConfig: { min: 0, max: 32, default: 0 } },
 ];
 
 export const day5Steps: GameStep[] = [
   { id: "5-1", instruction: "도형 도구에서 '별' 모양을 선택하세요.", targetElement: "star-tool", action: "click" },
   { id: "5-2", instruction: "캔버스에 별 모양을 그리세요.", targetElement: "draw-star", action: "click" },
   { id: "5-3", instruction: "'리소스' 메뉴(플러그인)를 열어주세요.", targetElement: "resources-menu", action: "click" },
   { id: "5-4", instruction: "'Unsplash'를 검색하세요.", targetElement: "search-unsplash", action: "input", inputPlaceholder: "Unsplash" },
   { id: "5-5", instruction: "'실행' 버튼을 클릭하세요.", targetElement: "run-plugin", action: "click" },
   { id: "5-6", instruction: "'자연' 사진을 선택하세요.", targetElement: "nature-photo", action: "click" },
   { id: "5-7", instruction: "별 모양을 사진 위로 배치하세요.", targetElement: "place-star", action: "click" },
   { id: "5-8", instruction: "별과 사진을 모두 선택하세요.", targetElement: "select-both", action: "click" },
   { id: "5-9", instruction: "툴바에서 '마스크로 사용'을 클릭하세요.", targetElement: "use-mask", action: "click" },
   { id: "5-10", instruction: "마스크 내부의 사진 크기를 조절하세요.", targetElement: "resize-photo", action: "click" },
 ];
 
 export const day6Steps: GameStep[] = [
   { id: "6-1", instruction: "텍스트 도구로 '홈' 텍스트를 만드세요.", targetElement: "create-home", action: "click" },
   { id: "6-2", instruction: "'소개' 텍스트를 만드세요.", targetElement: "create-about", action: "click" },
   { id: "6-3", instruction: "'연락처' 텍스트를 만드세요.", targetElement: "create-contact", action: "click" },
   { id: "6-4", instruction: "3개의 텍스트를 모두 선택하세요.", targetElement: "select-all", action: "click" },
   { id: "6-5", instruction: "'오토 레이아웃 추가'를 클릭하세요.", targetElement: "add-autolayout", action: "click" },
   { id: "6-6", instruction: "방향을 '가로'로 설정하세요.", targetElement: "direction-horizontal", action: "click" },
   { id: "6-7", instruction: "아이템 간격을 24px로 설정하세요.", targetElement: "gap-slider", action: "slider", sliderConfig: { min: 0, max: 48, default: 8 } },
   { id: "6-8", instruction: "가로 패딩을 32px로 설정하세요.", targetElement: "padding-horizontal", action: "slider", sliderConfig: { min: 0, max: 64, default: 16 } },
   { id: "6-9", instruction: "배경색을 추가하세요.", targetElement: "add-background", action: "click" },
   { id: "6-10", instruction: "'연락처'를 '문의하기'로 변경하세요 (자동 리사이즈 확인).", targetElement: "change-text", action: "input", inputPlaceholder: "문의하기" },
 ];
 
 export const day7Steps: GameStep[] = [
   { id: "7-1", instruction: "디자인한 버튼을 선택하세요.", targetElement: "select-button", action: "click" },
   { id: "7-2", instruction: "'컴포넌트 만들기' (다이아몬드 아이콘)를 클릭하세요.", targetElement: "create-component", action: "click" },
   { id: "7-3", instruction: "컴포넌트 이름을 '메인 버튼'으로 변경하세요.", targetElement: "component-name", action: "input", inputPlaceholder: "메인 버튼" },
   { id: "7-4", instruction: "에셋 패널에서 인스턴스를 캔버스로 드래그하세요.", targetElement: "drag-instance-1", action: "click" },
   { id: "7-5", instruction: "두 번째 인스턴스를 드래그하세요.", targetElement: "drag-instance-2", action: "click" },
   { id: "7-6", instruction: "메인 컴포넌트를 선택하세요.", targetElement: "select-main", action: "click" },
   { id: "7-7", instruction: "메인 컴포넌트 색상을 보라색으로 변경하세요.", targetElement: "change-color-purple", action: "click" },
   { id: "7-8", instruction: "모서리 반경을 0px로 변경하세요.", targetElement: "corner-radius-0", action: "click" },
   { id: "7-9", instruction: "첫 번째 인스턴스의 텍스트를 '지금 구매'로 오버라이드하세요.", targetElement: "override-text", action: "input", inputPlaceholder: "지금 구매" },
   { id: "7-10", instruction: "인스턴스에서 '모든 오버라이드 초기화'를 클릭하세요.", targetElement: "reset-overrides", action: "click" },
 ];
 
 export const day8Steps: GameStep[] = [
   { id: "8-1", instruction: "'디자인'에서 '프로토타입' 모드로 전환하세요.", targetElement: "prototype-mode", action: "click" },
   { id: "8-2", instruction: "'프레임 1'을 선택하세요.", targetElement: "select-frame-1", action: "click" },
   { id: "8-3", instruction: "연결 노드(플러스 표시)를 찾으세요.", targetElement: "connection-node", action: "click" },
   { id: "8-4", instruction: "'프레임 2'로 와이어를 연결하세요.", targetElement: "connect-to-frame-2", action: "click" },
   { id: "8-5", instruction: "트리거를 '클릭 시'로 설정하세요.", targetElement: "trigger-click", action: "click" },
   { id: "8-6", instruction: "액션을 '다음으로 이동'으로 설정하세요.", targetElement: "action-navigate", action: "click" },
   { id: "8-7", instruction: "애니메이션을 '스마트 애니메이트'로 설정하세요.", targetElement: "smart-animate", action: "click" },
   { id: "8-8", instruction: "이징을 'Ease Out'으로 설정하세요.", targetElement: "easing-out", action: "click" },
   { id: "8-9", instruction: "지속 시간을 300ms로 설정하세요.", targetElement: "duration-300", action: "slider", sliderConfig: { min: 100, max: 1000, default: 300 } },
   { id: "8-10", instruction: "'재생' 아이콘을 클릭하여 프리뷰를 확인하세요.", targetElement: "play-preview", action: "click" },
 ];
 
 export const day9Steps: GameStep[] = [
   { id: "9-1", instruction: "큰 프레임(데스크탑 사이즈)을 만드세요.", targetElement: "create-desktop", action: "click" },
   { id: "9-2", instruction: "그리드 레이아웃(칼럼)을 추가하세요.", targetElement: "add-grid", action: "click" },
   { id: "9-3", instruction: "왼쪽에 '로고'를 배치하세요.", targetElement: "place-logo", action: "click" },
   { id: "9-4", instruction: "중앙에 '메뉴'를 배치하세요.", targetElement: "place-menu", action: "click" },
   { id: "9-5", instruction: "오른쪽에 '로그인 버튼'을 배치하세요.", targetElement: "place-login", action: "click" },
   { id: "9-6", instruction: "로고와 메뉴를 그룹으로 묶으세요.", targetElement: "group-logo-menu", action: "click" },
   { id: "9-7", instruction: "그룹과 버튼을 오토 레이아웃으로 묶으세요.", targetElement: "autolayout-header", action: "click" },
   { id: "9-8", instruction: "간격 모드를 'Space Between'으로 설정하세요.", targetElement: "space-between", action: "click" },
   { id: "9-9", instruction: "너비를 'Fill Container'로 설정하세요.", targetElement: "fill-container", action: "click" },
   { id: "9-10", instruction: "'상단에 고정' 제약 조건을 설정하세요.", targetElement: "pin-top", action: "click" },
 ];
 
 export const day10Steps: GameStep[] = [
   { id: "10-1", instruction: "완성된 '데스크탑 프레임'을 선택하세요.", targetElement: "select-desktop", action: "click" },
   { id: "10-2", instruction: "속성 패널의 'Export' 섹션을 확인하세요.", targetElement: "export-section", action: "click" },
   { id: "10-3", instruction: "'+' 버튼을 클릭하여 내보내기 형식을 추가하세요.", targetElement: "add-export", action: "click" },
   { id: "10-4", instruction: "배율을 1x에서 2x로 변경하세요.", targetElement: "scale-2x", action: "click" },
   { id: "10-5", instruction: "또 다른 내보내기 형식을 추가하세요 (+).", targetElement: "add-export-2", action: "click" },
   { id: "10-6", instruction: "접미사를 '@2x'로 설정하세요.", targetElement: "suffix-2x", action: "input", inputPlaceholder: "@2x" },
   { id: "10-7", instruction: "형식을 PNG에서 JPG로 변경하세요.", targetElement: "format-jpg", action: "click" },
   { id: "10-8", instruction: "'미리보기' 버튼을 클릭하세요.", targetElement: "preview-export", action: "click" },
   { id: "10-9", instruction: "'프레임 내보내기' 버튼을 클릭하세요.", targetElement: "export-frame", action: "click" },
   { id: "10-10", instruction: "🎉 축하합니다! 모든 과정을 완료했습니다!", targetElement: "final-celebration", action: "click" },
 ];
 
 export const allDayConfigs: DayGameConfig[] = [
   { day: 1, title: "🗺️ 지도 탐험", subtitle: "인터페이스 & 프레임", steps: day1Steps },
   { day: 2, title: "🏗️ 구조물 배치", subtitle: "도형 & 정렬", steps: day2Steps },
   { day: 3, title: "📜 고대 문자", subtitle: "텍스트 & 타이포그래피", steps: day3Steps },
   { day: 4, title: "🎨 세상에 색칠하기", subtitle: "채우기, 선, 효과", steps: day4Steps },
   { day: 5, title: "✨ 이미지 소환", subtitle: "플러그인 & 마스크", steps: day5Steps },
   { day: 6, title: "🪄 오토 레이아웃 마법", subtitle: "오토 레이아웃 기초", steps: day6Steps },
   { day: 7, title: "🔮 대량 복제", subtitle: "컴포넌트", steps: day7Steps },
   { day: 8, title: "🌀 포탈 생성", subtitle: "프로토타이핑", steps: day8Steps },
   { day: 9, title: "🏰 성 설계도", subtitle: "웹 헤더 (GNB)", steps: day9Steps },
   { day: 10, title: "🚀 세상에 출시", subtitle: "내보내기", steps: day10Steps },
 ];
 
 export function getDayConfig(day: number): DayGameConfig | undefined {
   return allDayConfigs.find((config) => config.day === day);
 }