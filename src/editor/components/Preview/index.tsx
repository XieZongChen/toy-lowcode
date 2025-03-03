import React, { useRef } from 'react';
import { message } from 'antd';
import { useComponentConfigStore } from '@/editor/stores/component-config';
import { Component, useComponentsStore } from '@/editor/stores/components';
import { ActionConfig } from '../Setting/ActionModal';

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const componentRefs = useRef<Record<string, any>>({});

  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];

      if (eventConfig) {
        props[event.name] = (...args: any[]) => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            if (action.type === 'goToLink') {
              window.location.href = action.url;
            } else if (action.type === 'showMessage') {
              if (action.config.type === 'success') {
                message.success(action.config.text);
              } else if (action.config.type === 'error') {
                message.error(action.config.text);
              }
            } else if (action.type === 'customJS') {
              // new Function 可以传入任意个参数，最后一个是函数体，前面都会作为函数参数的名字
              const func = new Function('context', 'args', action.code);
              // 调用的时候传入参数
              // 在 code 中使用 context.name 即可拿到此处传入的 component.name
              func(
                {
                  name: component.name,
                  props: component.props,
                  showMessage(content: string) {
                    message.success(content);
                  },
                },
                args
              );
            } else if (action.type === 'componentMethod') {
              const component =
                componentRefs.current[action.config.componentId];

              if (component) {
                component[action.config.method]?.(...args);
              }
            }
          });
        };
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ref: (ref: Record<string, any>) => {
            componentRefs.current[component.id] = ref;
          },
          ...config.getDefaultProps(),
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
