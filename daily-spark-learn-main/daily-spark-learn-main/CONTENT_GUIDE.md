# GrowIt 콘텐츠 제작 가이드

이 문서는 GrowIt 미션 가이드의 스크린샷 플레이스홀더를 실제 이미지로 교체하는 방법을 설명합니다.

---

## 1. 스크린샷 촬영 방법

### Mac
1. Figma를 열고 캡처할 화면을 준비합니다.
2. `Cmd + Shift + 4`를 눌러 영역 선택 캡처를 시작합니다.
3. 원하는 영역을 드래그하여 선택합니다.
4. 스크린샷은 바탕화면에 자동 저장됩니다.

### Windows
1. Figma를 열고 캡처할 화면을 준비합니다.
2. `Win + Shift + S`를 눌러 캡처 도구를 엽니다.
3. 원하는 영역을 드래그하여 선택합니다.
4. 클립보드에 복사되므로 이미지 편집 프로그램에 붙여넣기 후 저장합니다.

### 권장 사항
- **해상도**: 최소 1200px 너비 권장
- **비율**: 16:9 또는 4:3 비율 유지
- **포맷**: PNG (투명 배경 필요시) 또는 JPG (파일 크기 최적화)
- **크기**: 파일당 500KB 이하 권장

---

## 2. 파일 명명 규칙

모든 스크린샷 파일은 다음 규칙을 따라 이름을 지정합니다:

```
day{일차}-step{단계}.png
```

### 예시
| Day | Step | 파일명 |
|-----|------|--------|
| 1 | 1 | `day1-step1.png` |
| 1 | 2 | `day1-step2.png` |
| 1 | 10 | `day1-step10.png` |
| 2 | 1 | `day2-step1.png` |
| 10 | 10 | `day10-step10.png` |

---

## 3. 파일 저장 위치

모든 스크린샷은 다음 폴더에 저장합니다:

```
public/images/guide/
```

### 폴더 구조
```
public/
└── images/
    └── guide/
        ├── day1-step1.png
        ├── day1-step2.png
        ├── day1-step3.png
        ├── ...
        ├── day10-step9.png
        └── day10-step10.png
```

> **참고**: `public/images/guide/` 폴더가 없다면 새로 생성해야 합니다.

---

## 4. 코드 업데이트 방법

스크린샷을 추가한 후, 데이터 파일을 업데이트해야 실제 이미지가 표시됩니다.

### 데이터 파일 위치
```
src/lib/missionContent.ts
```

### 수정 방법

1. `src/lib/missionContent.ts` 파일을 엽니다.

2. 각 step 객체에 `imageSrc` 속성을 추가하거나 수정합니다.

3. 현재 구조 예시:
```typescript
{
  id: 1,
  type: "action",
  instruction: "figma.com을 열고 로그인하세요.",
  buttonText: "로그인 완료",
  imageAlt: "Figma 로그인 화면",
  targetZone: "canvas",
  troubleshootTip: "구글 계정으로 간편하게 로그인할 수 있습니다."
}
```

4. `imageSrc` 속성 추가:
```typescript
{
  id: 1,
  type: "action",
  instruction: "figma.com을 열고 로그인하세요.",
  buttonText: "로그인 완료",
  imageAlt: "Figma 로그인 화면",
  imageSrc: "/images/guide/day1-step1.png",  // ← 이 줄 추가
  targetZone: "canvas",
  troubleshootTip: "구글 계정으로 간편하게 로그인할 수 있습니다."
}
```

### 타입 정의 업데이트

`imageSrc` 속성을 사용하려면 타입 정의도 업데이트해야 합니다:

```typescript
// src/lib/missionContent.ts 상단의 BaseStep 인터페이스

interface BaseStep {
  id: number;
  imageAlt: string;
  imageSrc?: string;  // ← 이 줄 추가 (optional)
  targetZone?: "toolbar-top" | "sidebar-left" | "sidebar-right" | "canvas" | "none";
  shortcutKey?: string;
  troubleshootTip?: string;
}
```

---

## 5. 이미지 표시 컴포넌트 수정

현재 `MissionDashboard.tsx`에서 플레이스홀더를 표시하고 있습니다. 실제 이미지를 표시하려면 다음과 같이 수정합니다:

### 현재 코드 (플레이스홀더)
```tsx
<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
  <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
</div>
```

### 수정된 코드 (실제 이미지)
```tsx
<div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
  {currentStep.imageSrc ? (
    <img 
      src={currentStep.imageSrc} 
      alt={currentStep.imageAlt}
      className="w-full h-full object-cover"
    />
  ) : (
    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
  )}
</div>
```

---

## 6. 체크리스트

이미지 추가 시 다음 사항을 확인하세요:

- [ ] 스크린샷이 명확하고 관련 UI 요소가 잘 보이는가?
- [ ] 파일명이 `day{N}-step{N}.png` 형식을 따르는가?
- [ ] 파일이 `public/images/guide/` 폴더에 저장되었는가?
- [ ] `missionContent.ts`에 `imageSrc` 속성이 추가되었는가?
- [ ] 브라우저에서 이미지가 정상적으로 로드되는가?

---

## 7. 문의

콘텐츠 제작 중 문제가 발생하면 개발팀에 문의하세요.
