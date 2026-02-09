import { type LocalizedText } from "@/lib/missionContent";

export interface Day {
  day: number;
  title: LocalizedText;
  objective: LocalizedText;
  videoId: string;
  mission: LocalizedText;
  hint?: LocalizedText;
}

export interface Curriculum {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  days: Day[];
}

export const figmaCurriculum: Curriculum = {
  id: "figma-basics",
  title: { ko: "Figma 입문", en: "Figma Basics" },
  description: { 
    ko: "디자인 툴 Figma의 기본기를 10일 만에 익혀보세요", 
    en: "Master the basics of the design tool Figma in 10 days" 
  },
  days: [
    {
      day: 1,
      title: { ko: "Figma가 뭔가요?", en: "What is Figma?" },
      objective: { ko: "Figma의 기본 개념과 인터페이스 이해하기", en: "Understand Figma's basic concepts and interface" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "Figma를 열고 새 파일을 만들어보세요. 파일 이름을 '나의 첫 Figma'로 지어주세요.", en: "Open Figma and create a new file. Name it 'My First Figma'." },
      hint: { ko: "figma.com에서 무료 계정을 만들 수 있어요!", en: "You can create a free account at figma.com!" },
    },
    {
      day: 2,
      title: { ko: "Frame 만들기", en: "Creating Frames" },
      objective: { ko: "Frame의 개념을 이해하고 직접 만들어보기", en: "Understand the concept of Frames and create your own" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "아이폰 사이즈의 Frame을 하나 만들어보세요.", en: "Create a Frame with iPhone dimensions." },
      hint: { ko: "F 키를 누르면 Frame 도구가 선택돼요.", en: "Press F to select the Frame tool." },
    },
    {
      day: 3,
      title: { ko: "도형 그리기", en: "Drawing Shapes" },
      objective: { ko: "기본 도형 도구 사용법 익히기", en: "Learn to use basic shape tools" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "사각형, 원, 선을 각각 하나씩 그려보세요.", en: "Draw one rectangle, one circle, and one line." },
      hint: { ko: "R은 사각형, O는 원, L은 선을 그리는 단축키예요.", en: "R for rectangle, O for circle, L for line." },
    },
    {
      day: 4,
      title: { ko: "색상과 스타일", en: "Colors & Styles" },
      objective: { ko: "Fill과 Stroke 설정하는 방법 배우기", en: "Learn to set Fill and Stroke" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "만든 도형에 다양한 색상을 적용해보세요.", en: "Apply different colors to the shapes you created." },
    },
    {
      day: 5,
      title: { ko: "텍스트 다루기", en: "Working with Text" },
      objective: { ko: "텍스트 도구와 폰트 설정 익히기", en: "Learn the text tool and font settings" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "자기소개를 담은 텍스트를 Frame 안에 배치해보세요.", en: "Place a self-introduction text inside a Frame." },
      hint: { ko: "T 키를 누르면 텍스트 도구가 선택돼요.", en: "Press T to select the text tool." },
    },
    {
      day: 6,
      title: { ko: "정렬과 배치", en: "Alignment & Layout" },
      objective: { ko: "Auto Layout과 정렬 기능 이해하기", en: "Understand Auto Layout and alignment features" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "여러 요소를 깔끔하게 정렬해보세요.", en: "Neatly align multiple elements." },
    },
    {
      day: 7,
      title: { ko: "컴포넌트 만들기", en: "Creating Components" },
      objective: { ko: "재사용 가능한 컴포넌트의 개념 이해", en: "Understand reusable components" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "버튼 컴포넌트를 하나 만들어보세요.", en: "Create a button component." },
      hint: { ko: "요소를 선택하고 Ctrl/Cmd + Alt + K를 눌러보세요.", en: "Select an element and press Ctrl/Cmd + Alt + K." },
    },
    {
      day: 8,
      title: { ko: "프로토타입 기초", en: "Prototype Basics" },
      objective: { ko: "화면 간 연결하는 방법 배우기", en: "Learn to connect screens" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "두 개의 Frame을 연결하는 프로토타입을 만들어보세요.", en: "Create a prototype connecting two Frames." },
    },
    {
      day: 9,
      title: { ko: "협업 기능", en: "Collaboration Features" },
      objective: { ko: "댓글과 공유 기능 활용하기", en: "Use comments and sharing features" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "파일 링크를 복사해서 친구에게 공유해보세요.", en: "Copy the file link and share it with a friend." },
    },
    {
      day: 10,
      title: { ko: "미니 프로젝트", en: "Mini Project" },
      objective: { ko: "배운 것을 활용해 간단한 앱 화면 만들기", en: "Create a simple app screen using what you learned" },
      videoId: "dXQ7IHkTiMM",
      mission: { ko: "앱의 로그인 화면을 직접 디자인해보세요. 배운 모든 것을 활용해보세요!", en: "Design a login screen. Use everything you've learned!" },
    },
  ],
};

// Storage helpers
export function getProgress(curriculumId: string): number[] {
  const stored = localStorage.getItem(`growit-progress-${curriculumId}`);
  return stored ? JSON.parse(stored) : [];
}

export function saveProgress(curriculumId: string, completedDays: number[]) {
  localStorage.setItem(`growit-progress-${curriculumId}`, JSON.stringify(completedDays));
}

export function completeDay(curriculumId: string, day: number) {
  const progress = getProgress(curriculumId);
  if (!progress.includes(day)) {
    progress.push(day);
    saveProgress(curriculumId, progress);
  }
}
