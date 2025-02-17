import { useDrop } from "react-dnd";
import { useComponentsStore } from "../stores/components";
import { useComponentConfigStore } from "../stores/component-config";

export function useMaterialDrop(accept: string[], id: number) {
    const { addComponent } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: { type: string }, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
                return;
            }

            const config = componentConfig[item.type];

            addComponent({
                id: new Date().getTime(),
                name: item.type,
                props: config.defaultProps,
                desc: config.desc
            }, id)
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop, drop }
}
