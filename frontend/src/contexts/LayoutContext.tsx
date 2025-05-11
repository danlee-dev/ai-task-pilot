import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 레이아웃 컨텍스트 상태 인터페이스
interface LayoutContextState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

// 기본값 생성 (TypeScript 타입 안전성 보장)
const defaultLayoutContext: LayoutContextState = {
  isSidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openSidebar: () => {},
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

  // 사이드바 토글 함수
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // 사이드바 닫기 함수
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // 사이드바 열기 함수
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // 컨텍스트 값
  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
