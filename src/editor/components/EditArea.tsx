import React, { useEffect } from 'react';
import { Component, useComponentsStore } from '../stores/components';
import { useComponentConfigStore } from '../stores/component-config';

export function EditArea() {
  const { components, addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.component) {
        return null;
      }

      return React.createElement(
        config.component,
        {
          key: component.id,
          ...config.defaultProps,
          ...component.props,
        },
        // components 是一个树形结构，这里要递归渲染 children
        renderComponents(component.children || [])
      );
    });
  }

  return (
    <div className='h-[100%]'>
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
    </div>
  );
}
