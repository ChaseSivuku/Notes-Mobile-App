import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Base spacing (dp). Use for consistent padding/margins across devices. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Horizontal screen padding - slightly larger on wider phones for readability. */
export const horizontalPadding = SCREEN_WIDTH <= 360 ? 14 : 16;

/** Minimum touch target size (dp) for accessibility. */
export const minTouchTarget = 44;

/** FAB size and offset from edges. */
export const fabSize = 56;
export const fabOffset = 20;

/** Extra list bottom padding so last item clears the FAB + safe area. */
export const listBottomPadding = 88;

/** Scale font size by screen width (optional). S22 ~360dp width. */
export function scaleFont(size: number): number {
  const scale = Math.min(SCREEN_WIDTH / 360, 1.2);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

export { SCREEN_WIDTH, SCREEN_HEIGHT };
