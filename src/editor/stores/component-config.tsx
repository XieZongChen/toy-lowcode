import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>; // 组件默认参数
  component: any; // 组件实例
  desc: string; // 组件描述
}

interface State {
  // componentConfig 的映射，key 是组件名，value 是组件配置
  componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: 'Container',
      defaultProps: {},
      component: Container,
      desc: '容器',
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      component: Button,
      desc: '按钮',
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      component: Page,
      desc: '页面',
    },
  },
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
