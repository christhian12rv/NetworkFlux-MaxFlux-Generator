import { getBezierPath, useStore, ReactFlowState, BaseEdge, EdgeLabelRenderer } from 'reactflow';

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX + offset} ${centerY + offset} ${targetX} ${targetY}`;
};

export const CustomEdge = (props) => {
  const { id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, label } = props;

	const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

	const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) || (e.target === source && e.source === target)
    );

    return edgeExists;
  });

	let customPath = '';

	if (isBiDirectionEdge) {
    customPath = getSpecialPath(props, sourceX < targetX ? 30 : -30);
  } else {
    [customPath] = getBezierPath(props);
  }

  return (
    <>
			<BaseEdge path={customPath} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<div
          style={{
            position: 'absolute',
            transform: `translate(${sourceX < targetX ? -100 : 0}%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton">
            {label}
          </button>
        </div>
			</EdgeLabelRenderer>
    </>
  );
};