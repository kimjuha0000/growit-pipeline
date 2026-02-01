export interface Day {
  day: number;
  title: string;
  objective: string;
  videoId: string;
  mission: string;
  hint?: string;
}

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  days: Day[];
}

export const figmaCurriculum: Curriculum = {
  id: "figma-basics",
  title: "Figma 입문",
  description: "디자인 툴 Figma의 기본기를 10일 만에 익혀보세요",
  days: [
    {
      day: 1,
      title: "Figma가 뭔가요?",
      objective: "Figma의 기본 개념과 인터페이스 이해하기",
      videoId: "dXQ7IHkTiMM",
      mission: "Figma를 열고 새 파일을 만들어보세요. 파일 이름을 '나의 첫 Figma'로 지어주세요.",
      hint: "figma.com에서 무료 계정을 만들 수 있어요!",
    },
    {
      day: 2,
      title: "Frame 만들기",
      objective: "Frame의 개념을 이해하고 직접 만들어보기",
      videoId: "dXQ7IHkTiMM",
      mission: "아이폰 사이즈의 Frame을 하나 만들어보세요.",
      hint: "F 키를 누르면 Frame 도구가 선택돼요.",
    },
    {
      day: 3,
      title: "도형 그리기",
      objective: "기본 도형 도구 사용법 익히기",
      videoId: "dXQ7IHkTiMM",
      mission: "사각형, 원, 선을 각각 하나씩 그려보세요.",
      hint: "R은 사각형, O는 원, L은 선을 그리는 단축키예요.",
    },
    {
      day: 4,
      title: "색상과 스타일",
      objective: "Fill과 Stroke 설정하는 방법 배우기",
      videoId: "dXQ7IHkTiMM",
      mission: "만든 도형에 다양한 색상을 적용해보세요.",
    },
    {
      day: 5,
      title: "텍스트 다루기",
      objective: "텍스트 도구와 폰트 설정 익히기",
      videoId: "dXQ7IHkTiMM",
      mission: "자기소개를 담은 텍스트를 Frame 안에 배치해보세요.",
      hint: "T 키를 누르면 텍스트 도구가 선택돼요.",
    },
    {
      day: 6,
      title: "정렬과 배치",
      objective: "Auto Layout과 정렬 기능 이해하기",
      videoId: "dXQ7IHkTiMM",
      mission: "여러 요소를 깔끔하게 정렬해보세요.",
    },
    {
      day: 7,
      title: "컴포넌트 만들기",
      objective: "재사용 가능한 컴포넌트의 개념 이해",
      videoId: "dXQ7IHkTiMM",
      mission: "버튼 컴포넌트를 하나 만들어보세요.",
      hint: "요소를 선택하고 Ctrl/Cmd + Alt + K를 눌러보세요.",
    },
    {
      day: 8,
      title: "프로토타입 기초",
      objective: "화면 간 연결하는 방법 배우기",
      videoId: "dXQ7IHkTiMM",
      mission: "두 개의 Frame을 연결하는 프로토타입을 만들어보세요.",
    },
    {
      day: 9,
      title: "협업 기능",
      objective: "댓글과 공유 기능 활용하기",
      videoId: "dXQ7IHkTiMM",
      mission: "파일 링크를 복사해서 친구에게 공유해보세요.",
    },
    {
      day: 10,
      title: "미니 프로젝트",
      objective: "배운 것을 활용해 간단한 앱 화면 만들기",
      videoId: "dXQ7IHkTiMM",
      mission: "앱의 로그인 화면을 직접 디자인해보세요. 배운 모든 것을 활용해보세요!",
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
