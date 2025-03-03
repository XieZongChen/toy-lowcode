import { useDrop } from "react-dnd";
import { getComponentById, useComponentsStore } from "../stores/components";
import { useComponentConfigStore } from "../stores/component-config";

export interface ItemType {
    type: string;
    dragType?: 'move' | 'add',
    id: number
}

export function useMaterialDrop(accept: string[], id: number) {
    const { components, addComponent, deleteComponent } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
                return;
            }

            if (item.dragType === 'move') {
                const component = getComponentById(item.id, components)!;
                // 拖动到自身无效
                if (component.id === id) return;

                deleteComponent(item.id);
                addComponent(component, id)
            } else {
                const config = componentConfig[item.type];

                addComponent({
                    id: new Date().getTime(),
                    name: item.type,
                    desc: config.desc,
                    props: config.defaultProps()
                }, id)
            }
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop, drop }
}
