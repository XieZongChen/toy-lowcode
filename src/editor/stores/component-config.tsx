import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

/**
 * 组件属性设置
 */
export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>; // 组件默认参数
  component: any; // 组件实例
  desc: string; // 组件描述
  setter?: ComponentSetter[];
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
      setter: [
        {
          name: 'type', // 字段名
          label: '按钮类型', // 表单文案
          type: 'select', // 表单类型
          options: [
            // 表单类型的配置项
            { label: '主按钮', value: 'primary' },
            { label: '次按钮', value: 'default' },
          ],
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        },
      ],
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
