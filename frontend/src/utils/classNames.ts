// src/utils/classNames.ts
// Utility functions for consistent class name generation

/**
 * Generates class names based on component state
 * @param baseClass - The base CSS class name
 * @param isAnimating - Whether animation is in progress
 * @param hasResponse - Whether there's a chat response
 * @param isSidebarOpen - Whether sidebar is open
 * @param defaultClass - Class for default state (when not animating or has response)
 * @param animatingClass - Class for animating state
 * @param activeClass - Class for active state (has response)
 * @param shiftedClass - Class for when sidebar is open
 * @returns A string of concatenated class names
 */
export const getStateBasedClassName = (
  baseClass: string,
  isAnimating: boolean,
  hasResponse: boolean,
  isSidebarOpen: boolean,
  defaultClass: string,
  animatingClass: string,
  activeClass: string,
  shiftedClass: string
): string => {
  let className = baseClass;

  // Apply state-specific classes
  if (isAnimating) {
    className += ` ${animatingClass}`;
  } else if (hasResponse) {
    className += ` ${activeClass}`;
  } else {
    className += ` ${defaultClass}`;
  }

  // Apply sidebar-specific class
  if (isSidebarOpen) {
    className += ` ${shiftedClass}`;
  }

  return className;
};
