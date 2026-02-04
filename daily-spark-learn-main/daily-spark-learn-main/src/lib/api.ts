// =======================================================================
// API UTILITY (데이터 이벤트 전송 모듈)
// =======================================================================
// 이 파일은 백엔드 데이터 파이프라인 서버와 통신하는 함수를 정의합니다.
// UI에서 발생하는 이벤트를 백엔드의 FastAPI 엔드포인트로 전송하는 역할을 합니다.
// =======================================================================

/**
 * 백엔드 API 서버의 기본 URL을 환경 변수에서 가져옵니다.
 *
 * Vite 프로젝트에서는 `import.meta.env.VITE_` 접두사를 사용하여 환경 변수를 클라이언트 사이드 코드에 안전하게 노출할 수 있습니다.
 * 1. 프로젝트 루트에 `.env` 또는 `.env.local` 파일을 생성합니다.
 * 2. `VITE_API_URL=http://<YOUR_SERVER_PUBLIC_IP>:3000` 형식으로 변수를 추가합니다.
 *
 * 만약 환경 변수가 설정되어 있지 않으면, 개발 목적으로 로컬호스트를 기본값으로 사용합니다.
 * 이는 Vercel 배포 시, Vercel 프로젝트 설정에서 해당 환경 변수를 설정해야 함을 의미합니다.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * 전송할 이벤트 데이터의 구조를 정의하는 인터페이스입니다.
 * 이 구조는 백엔드 FastAPI 서버가 기대하는 데이터 형식과 일치해야 합니다.
 */
export interface EventData {
  event_type: string; // 이벤트 유형 (e.g., 'button_click', 'page_view')
  user_id?: string | null; // 사용자 ID (로그인 시)
  anonymous_id?: string | null; // 익명 사용자 ID
  metadata?: object; // 추가 정보 (e.g., { 'page': '/', 'button_name': 'buy' })
}

/**
 * 지정된 이벤트 데이터를 백엔드 서버로 비동기적으로 전송합니다.
 *
 * @param eventData - 전송할 이벤트 데이터 객체. EventData 인터페이스를 준수해야 합니다.
 * @returns 성공 시 서버로부터 받은 JSON 응답을, 실패 시 null을 반환합니다.
 */
export const sendEvent = async (eventData: EventData) => {
  try {
    // fetch API를 사용하여 백엔드의 /api/events 엔드포인트에 POST 요청을 보냅니다.
    const response = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        // 전송하는 데이터의 본문(body)이 JSON 형식임을 서버에 알립니다.
        'Content-Type': 'application/json',
      },
      // JavaScript 객체를 JSON 문자열로 변환하여 요청 본문에 담아 보냅니다.
      body: JSON.stringify(eventData),
    });

    // 응답 상태가 'ok' (HTTP 상태 코드 200-299)가 아닌 경우, 에러를 발생시킵니다.
    if (!response.ok) {
      throw new Error(`Failed to send event: ${response.statusText} (Status: ${response.status})`);
    }

    // 서버로부터 받은 응답을 JSON 형태로 파싱하여 반환합니다.
    return await response.json();
  } catch (error) {
    // 네트워크 오류나 위에서 발생시킨 에러를 콘솔에 출력합니다.
    // 실제 프로덕션 환경에서는 이 부분을 Sentry나 다른 에러 트래킹 서비스와 연동할 수 있습니다.
    console.error('Error sending event:', error);
    return null;
  }
};
