import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import useWindowSize from "@/hooks/useWindowSize";

// 레이아웃 컨텍스트 상태 인터페이스
interface LayoutContextState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  windowWidth: number;
  windowHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  sidebarWidth: number; // 현재 사이드바 실제 너비
}

// 기본값 생성 (TypeScript 타입 안전성 보장)
const defaultLayoutContext: LayoutContextState = {
  isSidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openSidebar: () => {},
  windowWidth: 0,
  windowHeight: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  sidebarWidth: 300,
};

// 컨텍스트 생성
const LayoutContext = createContext<LayoutContextState>(defaultLayoutContext);

// 컨텍스트 사용을 위한 커스텀 훅
export const useLayout = () => useContext(LayoutContext);

// 프로바이더 컴포넌트
interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();
  const [sidebarWidth, setSidebarWidth] = useState(300);

  // 화면 크기에 따른 사이드바 너비 계산
  useEffect(() => {
    if (width >= 1200) {
      setSidebarWidth(300);
    } else if (width >= 1100) {
      setSidebarWidth(280);
    } else if (width >= 996) {
      setSidebarWidth(250);
    } else if (width >= 768) {
      setSidebarWidth(200);
    } else {
      setSidebarWidth(300); // 모바일에서는 전체 너비에 가깝게
    }
  }, [width]);

  // 화면이 모바일 크기일 때 사이드바 자동 닫기 기능 제거
  // useEffect(() => {
  //   if (isMobile && isSidebarOpen) {
  //     setSidebarOpen(false);
  //   }
  // }, [isMobile, isSidebarOpen]);

  // 사이드바 토글 함수 - 수정
  const toggleSidebar = useCallback(() => {
    console.log("토글 사이드바 호출됨, 현재 상태:", isSidebarOpen);

    // 중복 호출 방지를 위해 setTimeout과 prev 업데이트 방식 단순화
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // 사이드바 닫기 함수 - 수정
  const closeSidebar = useCallback(() => {
    console.log("사이드바 닫기 호출됨");
    // 이미 닫혀있으면 무시
    if (!isSidebarOpen) return;
    setSidebarOpen(false);
  }, [isSidebarOpen]);

  // 사이드바 열기 함수 - 수정
  const openSidebar = useCallback(() => {
    console.log("사이드바 열기 호출됨");
    // 이미 열려있으면 무시
    if (isSidebarOpen) return;
    setSidebarOpen(true);
  }, [isSidebarOpen]);

  // 컨텍스트 값
  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    windowWidth: width,
    windowHeight: height,
    isMobile,
    isTablet,
    isDesktop,
    sidebarWidth,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;
