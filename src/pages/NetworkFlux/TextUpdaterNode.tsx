import { Position, Handle } from 'reactflow';
import LampOffImg from '../../assets/img/lamp-off.jpeg';
import LampOnImg from '../../assets/img/lamp-on.jpeg';
import StackImg from '../../assets/img/stack.jpg';

export const TextUpdaterNode = ({data, isConnectable}) => {

  return (
    <div style={{ backgroundColor: '#e0e0e0', width: 50, height: 50, borderRadius: '50%', }}>
			{data.node !== 0 && data.reverseConnections.map((c, i) => {
				let sourcePosition = Position.Left;

				if (data.node !== 0 && data.node !== data.nodesQuantity - 1 && c.sourceNode !== data.nodesQuantity - 1 && c.sourceNode !== 0) {
					if (data.node % 2 !== 0 && c.sourceNode % 2 === 0)
						sourcePosition = Position.Top;
					else if (data.node % 2 === 0 && c.sourceNode % 2 !== 0)
						sourcePosition = Position.Bottom;
				}
				
				return (
					<>
						<Handle
							key={i}
							type="target"
							position={sourcePosition}
							id={c.id}
							isConnectable={isConnectable}
						/>
					</>
				);
			})}
			
			{(data.node !== data.nodesQuantity - 1 && data.node !== 0) ? (
				<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					{data.label}
				</div>
			) : (data.node  === 0 ? (
				<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
					backgroundImage: `url(${StackImg})`,
					backgroundPosition: 'center',
					backgroundSize: 'cover' }}>
				</div>
			) : (
				<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
					backgroundImage: `url(${data.maxFlow < data.maxFlowExpected ? LampOffImg : LampOnImg})`,
					backgroundPosition: 'center',
					backgroundSize: 'cover' }}>
				</div>
			))}
      
			
			{data.connections.map((c, i) => {
				let sourcePosition = Position.Right;

				if (data.node !== 0 && c.targetNode !== data.nodesQuantity - 1) {
					if (data.node % 2 !== 0 && c.targetNode % 2 === 0)
						sourcePosition = Position.Top;
					else if (data.node % 2 === 0 && c.targetNode % 2 !== 0)
						sourcePosition = Position.Bottom;
				}

				return (
					<Handle
						key={c.id}
						type="source"
						position={sourcePosition}
						id={c.id}
						isConnectable={isConnectable}
					/>
				);
			})}
    </div>
  );
}