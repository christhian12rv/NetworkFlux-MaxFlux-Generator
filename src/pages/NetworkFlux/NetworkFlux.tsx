import 'reactflow/dist/style.css';
import './NetworkFluxStyles.css';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, useReactFlow, Handle, Position, EdgeProps, useStore, BaseEdge, getBezierPath, ReactFlowState, EdgeLabelRenderer } from 'reactflow';
import { initialNodes, initialEdges } from './initialStates';
import { Button } from '../../components/Button';
import { TextArea } from '../../components/TextArea';
import generateNodesAndEdges from '../../utils/generateNodesAndEdges';
import { verifyMaxFlux } from '../../utils/verifyMaxFlux';
import PathFindingEdge from '@tisoap/react-flow-smart-edge';
import { CustomEdge } from './CustomEdge';
import { TextUpdaterNode } from './TextUpdaterNode';
import { Input } from '../../components/Input';

const nodeTypes = { textUpdater: TextUpdaterNode, };

const edgeTypes = {
	// smart: PathFindingEdge,
	customEdge: CustomEdge
};

export const NetworkFlux: React.FunctionComponent = () => {
	const windowSize = useRef([window.innerWidth, window.innerHeight]);
	
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const [rGraph, setRGraph] = useState({});
	const [stepStop, setStepStop] = useState(-1);

	const [verifyMaxFluxStarted, setVerifyMaxFluxStarted] = useState(false);

	const [jsonData, setJsonData] = useState('');
	const [maxFlowInitialFlux, setMaxFlowInitialFlux] = useState(0);
	const [maxFlowExpected, setMaxFlowExpected] = useState('');
	const { setViewport } = useReactFlow();

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	const handleTransform = useCallback((graphWidth: number) => {
    setViewport({ x: (windowSize.current[0] / 2) - (graphWidth / 2), y: 100, zoom: 1 }, { duration: 500 });
  }, [setViewport]);

	const onGenerateNetworkFluxBasedOnJsonButtonClick = (e?) => {
		if (e)
			e.preventDefault();

		try {
			JSON.parse(jsonData);
		} catch (error) {
			return alert('Json inválido');
		}

		if (!maxFlowExpected.trim())
			return alert('Fluxo máximo esperado inválido');

		const data = JSON.parse(jsonData);

		const {nodes: generatedNodes, edges: generatedEdges, graphWidth, maxFlow} = generateNodesAndEdges(data, maxFlowExpected, null);
		setMaxFlowInitialFlux(maxFlow);
		setNodes(generatedNodes);
		setEdges(generatedEdges);
		handleTransform(graphWidth);
	}

	const verifyMaxFluxClick = (e?, previousOrNext?,) => {
		if (e)
			e.preventDefault();

		if (!verifyMaxFluxStarted)
			setVerifyMaxFluxStarted(true);

		if (previousOrNext && previousOrNext === 'next')
			setStepStop((st) => st + 1);
		else if (previousOrNext && previousOrNext === 'previous') {
			if (stepStop <= 0) {
				setVerifyMaxFluxStarted(false);

				if (stepStop > -1)
					setStepStop((st) => st - 1);

				onGenerateNetworkFluxBasedOnJsonButtonClick();
				return;
			} else
				setStepStop((st) => st - 1);
		}
		
	}

	useEffect(() => {
		if (stepStop <= -1)
			return;

		const { maxFlow, rGraph, finished } = verifyMaxFlux(jsonData, stepStop);

		console.log(maxFlow, maxFlowExpected);

		const {nodes: generatedNodes, edges: generatedEdges, graphWidth} = generateNodesAndEdges(rGraph, maxFlowExpected, maxFlowInitialFlux);
		setNodes(generatedNodes);
		setEdges(generatedEdges);

		handleTransform(graphWidth);

		if (finished) {
			setVerifyMaxFluxStarted(false);
			setStepStop(-1);
			alert(`O Fluxo Máximo é: ${maxFlow}`);
			onGenerateNetworkFluxBasedOnJsonButtonClick();
		}
	}, [stepStop]);

	const onJsonDataTextAreaChange = (e) => {
		setJsonData(e.target.value);
	};

	const onMaxFlowExpectedChange = (e) => {
    setMaxFlowExpected(e.target.value);
  };

	return (
		<>
			<div className='form-generator-box items-center'>
				<form className='maxW mx-auto'>
					
					<TextArea
						value={jsonData}
						onChange={onJsonDataTextAreaChange}
						style={{ width: '500px' }}
						rows={10}
					/>

					<Input type='number' value={maxFlowExpected} onChange={onMaxFlowExpectedChange} placeholder='Fluxo Máximo esperado'/>

					<Button onClick={onGenerateNetworkFluxBasedOnJsonButtonClick}>Gerar Rede de Fluxo</Button>
					{!verifyMaxFluxStarted ? <Button onClick={verifyMaxFluxClick}>Verificar Fluxo Máximo</Button>
						: <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, }}>
							<Button onClick={(e) => verifyMaxFluxClick(e, 'previous')}>Voltar Passo</Button>
							<Button onClick={(e) => verifyMaxFluxClick(e, 'next')}>Andar Passo</Button>
						</div>}

				</form>
			</div>

			<div style={{ width: 'calc(100vw - 3.2em)', height: '100vh', padding: '1em', }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
				/>
			</div>
		</>
	)
}
