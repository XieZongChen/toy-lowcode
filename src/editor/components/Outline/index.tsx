import { Tree } from 'antd';
import { useComponentsStore } from '@/editor/stores/components';

export function Outline() {
  const { components, setCurComponentId } = useComponentsStore();

  return (
    <Tree
      fieldNames={{ title: 'desc', key: 'id' }}
      treeData={components as any}
      showLine
      defaultExpandAll
      onSelect={([selectedKey]) => {
        // 选中时切换 CurComponentId 保证和画布区域联动
        setCurComponentId(selectedKey as number);
      }}
    />
  );
}
