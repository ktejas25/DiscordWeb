import type { ThemeConfig } from 'antd';

export const harmonyTheme: ThemeConfig = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorBgBase: '#141419',
    colorBgContainer: '#1a1b21',
    colorBgElevated: '#1f2028',
    colorText: '#f9fafb',
    colorTextSecondary: '#9ca3af',
    colorBorder: '#26272f',
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    controlHeight: 44,
  },
  components: {
    Button: {
      primaryColor: '#ffffff',
      controlHeight: 44,
      borderRadius: 12,
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: '#1a1b21',
      colorBorder: '#26272f',
      controlHeight: 44,
      borderRadius: 12,
      activeShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
    },
    Card: {
      colorBgContainer: '#1a1b21',
      borderRadiusLG: 16,
    },
    Modal: {
      contentBg: '#1a1b21',
      borderRadiusLG: 16,
    },
  },
};
