import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '../../stores/components';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface SelectedMaskProps {
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
}

function SelectedMask({
  containerClassName,
  portalWrapperClassName,
  componentId,
}: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const {
    components,
    curComponentId,
    curComponent,
    deleteComponent,
    setCurComponentId,
  } = useComponentsStore();

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  useEffect(() => {
    // 当样式改变的时候，编辑框的大小不会跟着改变
    // 这是因为 components 变了，到渲染完成，然后再 getBoundingClientRect 拿到改变后的宽高是有一段时间的
    // 所以这里需要加延时确保能拿到最新的宽高
    setTimeout(() => {
      updatePosition();
    }, 200);
  }, [components]);

  useEffect(() => {
    // 用 ResizeObserver 监听 containerClassName 可同时处理页面大小改变和内部面板大小改变两种情况
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;
    resizeObserver.observe(container);
    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollLeft,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!;
  }, []);

  const curSelectedComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  function handleDelete() {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  }

  const parentComponents = useMemo(() => {
    const parentComponents = [];
    let component = curComponent;

    while (component?.parentId) {
      // 向上遍历，直到找不到父级，将每个遍历出的父级都放到数组
      component = getComponentById(component.parentId, components)!;
      parentComponents.push(component);
    }

    return parentComponents;
  }, [curComponent]);

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          border: '1px dashed blue',
          pointerEvents: 'none',
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: '14px',
          zIndex: 13,
          display: !position.width || position.width < 10 ? 'none' : 'inline',
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              },
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: '0 8px',
                backgroundColor: 'blue',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {curSelectedComponent?.desc}
            </div>
          </Dropdown>
          {/* 如果 id 不为 1，说明不是 Page 组件，显示删除按钮 */}
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
              <Popconfirm
                title='确认删除？'
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  );
}

export default SelectedMask;
