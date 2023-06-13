import { Node, Edge, MarkerType, Position, } from 'reactflow';
import { verifyMaxFlux } from './verifyMaxFlux';

type ReturnType = {
	nodes: Node<any, string>[],
	edges: Edge<any>[],
	graphWidth: number,
	maxFlow: number,
}

export default function generateNodesAndEdges(data, maxFlowExpected, maxFlowInitialFlux?): ReturnType {
	const nodes: Node<any, string>[] = [];
	const edges: Edge<any>[] = [];

	let countOf2 = 0;
	let nodeHorizontalSteps = 0;
	let graphWidth = 0;



	const verifyMaxFluxResponse = verifyMaxFlux(data, null);

	const maxFlow = maxFlowInitialFlux ? maxFlowInitialFlux : verifyMaxFluxResponse.maxFlow;

	data.forEach((node, nodeIndex) => {
		nodes.push({
				id: nodeIndex.toString(),
				position: {
					x: (countOf2 === 1 && (nodeIndex !== data.length - 1) ? (nodeHorizontalSteps - 1) : nodeHorizontalSteps) * 200,
					y: (nodeIndex === 0 || nodeIndex === data.length - 1) ? 125 : (nodeIndex % 2 === 0 ? 0 : 250),
				},
				data: {
					label: nodeIndex === 0 ? 's' : (nodeIndex === (data.length - 1) ? 't' : nodeIndex.toString()),
					node: nodeIndex,
					nodesQuantity: data.length,
					connections: node.map((n, i) => ({ 	
						id: 's' + nodeIndex.toString() + '-' + i.toString(),
						targetNode: i,
						value: n,
					})).filter(n => n.value > 0),
					reverseConnections: data.map((nd, ndI) => {
						const connectionExists = nd.some((n, i) => ndI !== i && i === nodeIndex && n > 0);

						return {
							id: 't' + nodeIndex.toString() + '-' + ndI.toString(),
							sourceNode: ndI,
							connectionExists,
						}
					}).filter(n => n.connectionExists).map(n => ({
						id: n.id,
						sourceNode: n.sourceNode,
						targetNode: nodeIndex
					})),
					maxFlow,
					maxFlowExpected,
				},
				type: 'textUpdater',
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
				style: { 'borderRadius': '50%', width: '50px', 'height': '50px', }
		});

		if (nodeIndex !== 0) {
			countOf2 = countOf2 === 1 ? 0 : countOf2 + 1;
		}

		if (nodeIndex === 0 || countOf2 === 1) {
			nodeHorizontalSteps++;
			graphWidth += 50 + 200;
		}

		node.forEach((connectedNode, connectedNodeIndex) => {
			if (connectedNode <= 0)
				return;

			edges.push({
				id: `e${nodeIndex.toString()}-${connectedNodeIndex.toString()}`,
				source: nodeIndex.toString(),
				sourceHandle: 's' + nodeIndex.toString() + '-' + connectedNodeIndex.toString(),
				targetHandle: 't' + connectedNodeIndex.toString() + '-' + nodeIndex.toString(),
				target: connectedNodeIndex.toString(),
				label: connectedNode,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: '#FF0072',
				},
				style: {
					strokeWidth: 2,
					stroke: '#FF0072',
				},
				animated: true,
				type: 'customEdge',
			})
		})
	})

	graphWidth -= 250;

	return { nodes, edges, graphWidth, maxFlow };
}