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
  });

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

    // 因为 boundingClientRect 只是可视区的距离，所以算绝对定位的位置需要加上已滚动的距离
    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
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

  return createPortal(
    <div
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        border: '1px dashed blue',
        pointerEvents: 'none', // 注意不用响应鼠标事件
        width: position.width,
        height: position.height,
        zIndex: 12,
        borderRadius: 4,
        boxSizing: 'border-box',
      }}
    />,
    el
  );
}

export default HoverMask;
