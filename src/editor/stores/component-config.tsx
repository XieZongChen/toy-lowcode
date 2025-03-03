import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';
import ModalDev from '../materials/Modal/dev';
import ModalProd from '../materials/Modal/prod';
import TableDev from '../materials/Table/dev';
import TableProd from '../materials/Table/prod';
import TableColumnDev from '../materials/TableColumn/dev';
import TableColumnProd from '../materials/TableColumn/prod';
import FormDev from '../materials/Form/dev';
import FormProd from '../materials/Form/prod';
import FormItemDev from '../materials/FormItem/dev';
import FormItemProd from '../materials/FormItem/prod';

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

export interface ComponentMethod {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  getDefaultProps: (initValue?: Record<string, any>) => Record<string, any>; // 组件默认参数
  desc: string; // 组件描述
  setter?: ComponentSetter[];
  stylesSetter?: ComponentSetter[];
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
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
      getDefaultProps: () => ({}),
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: 'Button',
      desc: '按钮',
      getDefaultProps: (init = {}) => ({
        type: 'primary',
        text: '按钮',
        ...init,
      }),
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
      events: [
        {
          name: 'onClick',
          label: '点击事件',
        },
        {
          name: 'onDoubleClick',
          label: '双击事件',
        },
      ],
    },
    Page: {
      name: 'Page',
      desc: '页面',
      getDefaultProps: () => ({}),
      dev: PageDev,
      prod: PageProd,
    },
    Modal: {
      name: 'Modal',
      desc: '弹窗',
      getDefaultProps: (init = {}) => ({
        title: '弹窗',
        ...init,
      }),
      dev: ModalDev,
      prod: ModalProd,
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: 'onOk',
          label: '确认事件',
        },
        {
          name: 'onCancel',
          label: '取消事件',
        },
      ],
      methods: [
        {
          name: 'open',
          label: '打开弹窗',
        },
        {
          name: 'close',
          label: '关闭弹窗',
        },
      ],
    },
    Table: {
      name: 'Table',
      getDefaultProps: () => ({}),
      desc: '表格',
      setter: [
        {
          name: 'url',
          label: 'url',
          type: 'input',
        },
      ],
      dev: TableDev,
      prod: TableProd,
    },
    TableColumn: {
      name: 'TableColumn',
      desc: '表格列',
      getDefaultProps: (init = {}) => ({
        dataIndex: `col_${new Date().getTime()}`,
        title: '列名',
        ...init,
      }),
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'text',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
        {
          name: 'dataIndex',
          label: '字段',
          type: 'input',
        },
      ],
      dev: TableColumnDev,
      prod: TableColumnProd,
    },
    Form: {
      name: 'Form',
      getDefaultProps: () => ({}),
      desc: '表单',
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      events: [
        {
          name: 'onFinish',
          label: '提交事件',
        },
      ],
      methods: [
        {
          name: 'submit',
          label: '提交',
        },
      ],
      dev: FormDev,
      prod: FormProd,
    },
    FormItem: {
      name: 'FormItem',
      desc: '表单项',
      getDefaultProps: (init = {}) => ({
        name: new Date().getTime(),
        label: '姓名',
        ...init,
      }),
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'input',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'label',
          label: '标题',
          type: 'input',
        },
        {
          name: 'name',
          label: '字段',
          type: 'input',
        },
        {
          name: 'rules',
          label: '校验',
          type: 'select',
          options: [
            {
              label: '必填',
              value: 'required',
            },
          ],
        },
      ],
      dev: FormItemDev,
      prod: FormItemProd,
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
