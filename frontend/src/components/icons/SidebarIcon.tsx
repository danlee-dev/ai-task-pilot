// components/icons/SidebarIcon.tsx
import { useLayout } from "@/contexts/LayoutContext";

export default function SidebarIcon({ size = 18, color = "currentColor" }) {
  const { isSidebarOpen } = useLayout();

  // 사이드바가 열렸을 때는 화살표가 왼쪽, 닫혔을 때는 오른쪽을 향하도록 함
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill={color}
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: isSidebarOpen ? "scaleX(-1)" : "scaleX(1)" }}
    >
      <path d="M49.984,56l-35.989,0c-3.309,0 -5.995,-2.686 -5.995,-5.995l0,-36.011c0,-3.308 2.686,-5.995 5.995,-5.995l35.989,0c3.309,0 5.995,2.687 5.995,5.995l0,36.011c0,3.309 -2.686,5.995 -5.995,5.995Zm-25.984,-4.001l0,-39.999l-9.012,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,34.021c0,1.65 1.339,2.989 2.989,2.989l9.012,0Zm24.991,-39.999l-20.991,0l0,39.999l20.991,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-34.021c0,-1.65 -1.339,-2.989 -2.989,-2.989Z" />
      <path d="M19.999,38.774l-6.828,-6.828l6.828,-6.829l2.829,2.829l-4,4l4,4l-2.829,2.828Z" />
    </svg>
  );
}
