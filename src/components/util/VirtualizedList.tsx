import { cloneElement, useMemo, useState } from "react";
import useElementSize from "../../hooks/useElementSize";
import { throttle } from "lodash";

interface Props {
  rowHeight: number;
  bufferedItems?: number;
  gap?: number;
  preListSpacer?: number;
  postListSpacer?: number;
  children: Array<JSX.Element>;
  isVirtualizationEnabled?: boolean;
  className: string;
}

const VirtualizedList = ({
  rowHeight,
  gap = 1,
  preListSpacer = 0,
  postListSpacer = 0,
  bufferedItems = 2,
  children,
  isVirtualizationEnabled = true,
  className,
}: Props) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [containerRef, { height: containerHeight }] =
    useElementSize<HTMLUListElement>();

  const onScroll = useMemo(
    () =>
      throttle(
        function (e: any) {
          setScrollPosition(e.target.scrollTop);
        },
        50,
        { leading: false }
      ),
    []
  );

  const visibleChildren = useMemo(() => {
    if (!isVirtualizationEnabled)
      return children.map((child, index) =>
        cloneElement(child, {
          style: {
            position: "absolute",
            top: index * rowHeight + index * gap + 100,
            height: rowHeight,
            left: 0,
            right: 0,
            // lineHeight: `${rowHeight}px`,
          },
        })
      );
    const startIndex = Math.max(
      Math.floor(scrollPosition / rowHeight) - bufferedItems,
      0
    );
    const endIndex = Math.min(
      Math.ceil((scrollPosition + containerHeight) / rowHeight - 1) +
        bufferedItems,
      children.length - 1
    );

    return children.slice(startIndex, endIndex + 1).map((child, index) =>
      cloneElement(child, {
        style: {
          position: "absolute",
          top: (startIndex + index) * rowHeight + index * gap + preListSpacer,
          height: rowHeight,
          left: 0,
          right: 0,
          // lineHeight: `${rowHeight}px`,
        },
      })
    );
  }, [
    children,
    containerHeight,
    rowHeight,
    scrollPosition,
    gap,
    isVirtualizationEnabled,
  ]);

  return (
    <ul onScroll={onScroll} ref={containerRef} className={className}>
      <div className='pre-list-spacer'></div>
      {visibleChildren}
      <div className='post-list-spacer'></div>
    </ul>
  );
};

export default VirtualizedList;
