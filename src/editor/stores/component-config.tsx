import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';

/**
 * 组件属性设置
 */
export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>; // 组件默认参数
  desc: string; // 组件描述
  setter?: ComponentSetter[];
  stylesSetter?: ComponentSetter[];
  events?: ComponentEvent[];
  dev: any;
  prod: any;
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
      desc: '容器',
      defaultProps: {},
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: 'Button',
      desc: '按钮',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      dev: ButtonDev,
      prod: ButtonProd,
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
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
    },
    Page: {
      name: 'Page',
      desc: '页面',
      defaultProps: {},
      dev: PageDev,
      prod: PageProd,
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
