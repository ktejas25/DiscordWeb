import { ConfigProvider, App } from 'antd';
import { harmonyTheme } from '@/theme/antd.config';
import type { ReactNode } from 'react';

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={harmonyTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
