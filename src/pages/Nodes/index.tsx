import React from 'react';

import type { Edge, Node } from 'react-flow-renderer';
import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import { FiSettings } from 'react-icons/fi';
import { RiMindMap } from 'react-icons/ri';

import { IconButton } from '@components/generic/button/IconButton';
import { Layout } from '@components/layout';
import { SidebarItem } from '@components/layout/Sidebar/SidebarItem';
import { Hashicon } from '@emeraldpay/hashicon-react';
import { useAppSelector } from '@hooks/useAppSelector';

export const Nodes = (): JSX.Element => {
  const [graphNodes, setGraphNodes] = React.useState<Node[]>([]);
  const [graphEdges, setGraphEdges] = React.useState<Edge[]>([]);
  const [selected, setSelected] = React.useState<number>(0);
  const nodes = useAppSelector((state) => state.meshtastic.nodes);
  const myNodeNum = useAppSelector(
    (state) => state.meshtastic.radio.hardware.myNodeNum,
  );

  React.useEffect(() => {
    const tmpNodes: Node[] = [];
    // User Terminal
    tmpNodes.push({
      id: '1',
      type: 'input',

      data: { label: 'User Terminal' },
      position: { x: 160 + 500, y: 0 + 500 },
    });

    nodes.map((node, index) => {
      tmpNodes.push({
        id: node.number.toString(),
        data: { label: node.user?.longName ?? `Unknown ${node.number}` },
        position: { x: index * 160 + 500, y: 100 + 500 },
      });
    });

    setGraphNodes(tmpNodes);
  }, [nodes, myNodeNum]);

  React.useEffect(() => {
    const tmpEdges: Edge[] = [];

    nodes.map((node, index) => {
      if (node.number === myNodeNum) {
        tmpEdges.push({
          id: `e${1}-${myNodeNum}`,
          source: '1',
          target: myNodeNum.toString(),
          type: 'smoothstep',
          style: {
            stroke: 'yellow',
            strokeWidth: 2,
          },
        });
      }

      node.routes.map((route) => {
        tmpEdges.push({
          id: `e${route.from}-${route.to}`,
          source: node.number.toString(),
          target: route.to.toString(),
          type: 'smoothstep',
          animated: true,
        });
      });
    });

    setGraphEdges(tmpEdges);
  }, [nodes, myNodeNum]);

  return (
    <Layout
      title="Nodes"
      icon={<RiMindMap />}
      sidebarContents={
        <>
          {nodes.map((node) => (
            <SidebarItem
              key={node.number}
              selected={node.number === selected}
              setSelected={(): void => {
                setSelected(node.number);
              }}
              actions={
                <IconButton
                  onClick={(e): void => {
                    e.stopPropagation();
                    setSelected(node.number);
                  }}
                  icon={<FiSettings />}
                />
              }
            >
              <div className="flex dark:text-white">
                <div className="m-auto">
                  <Hashicon value={node.number.toString()} size={32} />
                </div>
              </div>
              <div className="my-auto mr-auto text-xs font-semibold dark:text-gray-400">
                {node.lastHeard.getTime()
                  ? node.lastHeard.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Never'}
              </div>
            </SidebarItem>
          ))}
        </>
      }
    >
      <div className="relative flex h-full w-full">
        <ReactFlow nodes={graphNodes} edges={graphEdges}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </Layout>
  );
};