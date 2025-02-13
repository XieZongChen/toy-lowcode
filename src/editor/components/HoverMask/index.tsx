import {
  getComponentById,
  useComponentsStore,
} from '@/editor/stores/components';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface HoverMaskProps {
  containerClassName: string; // 画布区的根元素的 className
  componentId: number; // hover 的组件 id
}

function HoverMask({ containerClassName, componentId }: HoverMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const { components } = useComponentsStore();

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  function updatePosition() {
    if (!componentId) return;

    // 分别获取两个元素的 boundingClientRect
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;
    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    // 分别获取两个元素的位置信息
    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    // label 的定位计算
    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      // 最外层的 page 组件，label 可能会超出边界，此时 label 需要显示在内部
      labelTop -= -20;
    }

    // 因为 boundingClientRect 只是可视区的距离，所以算绝对定位的位置需要加上已滚动的距离
    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  // 创建一个 div 挂载在容器下，用于存放 portal
  const el = useMemo(() => {
    const el = document.createElement('div');
    el.className = `wrapper`;

    const container = document.querySelector(`.${containerClassName}`);
    container!.appendChild(el);
    return el;
  }, []);

  // 当前组件信息
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          backgroundColor: 'rgba(0, 0, 255, 0.05)',
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
          {curComponent?.name}
        </div>
      </div>
    </>,
    el
  );
}

export default HoverMask;
