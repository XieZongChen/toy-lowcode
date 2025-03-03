import { CSSProperties } from 'react';
import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * low code json 项，整个 json 是由一个个项组成的树形结构
 */
export interface Component {
  id: number;
  name: string;
  props: any;
  desc: string;
  styles?: CSSProperties;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
  mode: 'edit' | 'preview'; // 画布区域状态
  curComponentId?: number | null; // 选中的组件 id
  curComponent: Component | null; // 选中的组件
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
  setCurComponentId: (componentId: number | null) => void;
  updateComponentStyles: (
    componentId: number,
    styles: CSSProperties,
    replace?: boolean
  ) => void;
  setMode: (mode: State['mode']) => void;
}

const creator: StateCreator<State & Action> = (set, get) => ({
  components: [
    {
      id: 1,
      name: 'Page',
      props: {},
      desc: '页面',
    },
  ],
  curComponentId: null,
  curComponent: null,
  setCurComponentId: (componentId) =>
    set((state) => ({
      curComponentId: componentId,
      curComponent: getComponentById(componentId, state.components),
    })),
  mode: 'edit',
  setMode: (mode) => set({ mode }),
  /**
   * 在一个 parentId 下新增一个 component
   * - 未传 parentId 或没查到 parentComponent 则会将 component 添加到根
   * @param component
   * @param parentId
   * @returns
   */
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);

        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }

        component.parentId = parentId;
        return { components: [...state.components] };
      }
      return { components: [...state.components, component] };
    }),
  /**
   * 删除一个 component
   * @param componentId
   * @returns
   */
  deleteComponent: (componentId) => {
    if (!componentId) return;

    const component = getComponentById(componentId, get().components);
    if (component?.parentId) {
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      );

      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        );

        set({ components: [...get().components] });
      }
    }
  },
  /**
   * 修改一个 component 的 props
   * @param componentId
   * @param props
   * @returns
   */
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.props = { ...component.props, ...props };

        return { components: [...state.components] };
      }

      return { components: [...state.components] };
    }),
  /**
   * 修改一个 component 的 styles
   * @param componentId
   * @param styles
   * @returns
   */
  updateComponentStyles: (componentId, styles, replace) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.styles = replace
          ? { ...styles }
          : { ...component.styles, ...styles };

        return { components: [...state.components] };
      }

      return { components: [...state.components] };
    }),
});

export const useComponentsStore = create<State & Action>()(
  persist(creator, {
    name: 'toy-lowcode',
    partialize: (state) => {
      // 过滤掉 curComponentId，让 SelectedMask 重新渲染，避免 SelectedMask 中的 querySelector 获取不到目标 dom
      const { curComponentId, ...restState } = state;
      return restState;
    },
  })
);

/**
 * 找到 components 中 id 的父级 component
 * @param id
 * @param components
 * @returns
 */
export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null;

  for (const component of components) {
    if (component.id == id) return component;
    if (component.children && component.children.length > 0) {
      // 递归遍历整个树
      const result = getComponentById(id, component.children);
      if (result !== null) return result;
    }
  }
  return null;
}
