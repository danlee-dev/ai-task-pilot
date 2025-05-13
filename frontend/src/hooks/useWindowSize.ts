import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * 윈도우 크기를 감지하여 반응형 레이아웃에 필요한 정보를 제공하는 커스텀 훅
 * @returns 윈도우 크기 정보 및 디바이스 유형 정보
 */
const useWindowSize = (): WindowSize => {
  // 초기 상태는 SSR 호환성을 위해 기본값 설정
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    // SSR 환경에서는 실행하지 않음
    if (typeof window === "undefined") return;

    // 크기 계산 및 디바이스 유형 판단 함수
    const calculateSize = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // 초기 계산
    calculateSize();

    // resize 이벤트에 리스너 추가
    window.addEventListener("resize", calculateSize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", calculateSize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
