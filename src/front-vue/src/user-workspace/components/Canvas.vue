<template>
    <div>
        <link rel="stylesheet" type="text/css" href="../../../vendor/vis-network.min.css" />
        <div id="canvas" ref="canvas"></div>
    </div>
</template>


<style lang="scss">
#canvas {
            width: 1600px;
            height: 600px;
            border: 1px solid lightgray;
        }
</style>


<script lang="ts">
import * as _ from 'lodash';

import vis from 'vis';

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Stack } from '../../../../common/stack/Stack';

import { sampleStack } from '../sampleStack';

@Component
export default class Canvas extends Vue {

    public network: vis.Network;
    public visNodes: any;
    public stack = sampleStack;

    public createNetwork(component: HTMLElement, nodes: any, edges: any): vis.Network {
        let data = {
            nodes: nodes,
            edges: edges,
        };
        let options = {
            interaction: {
                hover: true,
            }
        };
        return new vis.Network(component, data, options);
    }

    public mounted(): void {
        this.visNodes = this.componentsToVisNodes(this.stack);
        let hierarchyEdgesData = this.hierarchyToEdgesData(this.stack);
        let linkEdgesData = this.linksToEdgesData(this.stack);
        let edgesData = hierarchyEdgesData.concat(linkEdgesData);
        this.network = this.createNetwork(this.$refs.canvas as HTMLElement, this.visNodes, edgesData);
        let clusteringGroups = this.calculateClusteringGroups(this.visNodes);
        this.clusterNetworkByHierarchy(this.network, this.visNodes, clusteringGroups);

        this.network.on('selectNode', (sth: any) => {
            _.map(sth.nodes, (nodeId) => {
                // find component
                for (let component of this.stack.walk()) {
                    if (component.id === nodeId) {
                        this.$emit('componentClicked', component);
                    }
                }
            });
        });

        this.network.on('hoverNode', (event: any) => {
            // alert(event.node);
        });

        this.network.on('doubleClick', (event: any) => {
            _.map(event.nodes, (nodeId) => {
                if (this.network.isCluster(nodeId)) {
                    this.network.openCluster(nodeId);
                } else {
                    // close cluster
                    let nodeData = this.visNodes.get(nodeId);
                    this.clusterNodesByItsGroup(this.network, nodeData.group);
                }
            });
        });
    }

    public clusterNetworkByHierarchy(network: vis.Network, nodes: any, clusteringGroups: any): void {
        for (let group of clusteringGroups) {
            // let node = nodes.get(group);
            this.clusterNodesByItsGroup(network, group);
        }
    }

    private clusterNodesByItsGroup(network: vis.Network, group: string): void {
        let options = {
            joinCondition: (nodeOptions: any) => {
                return nodeOptions.group === group || nodeOptions.id === group;
            },
            clusterNodeProperties: {
                label: group
            }
        };
        network.cluster(options);
    }

    private calculateClusteringGroups(visNodes: any): any[] {
        // from bottom level of hierarchy to the top
        let nodesData = _.map(visNodes.getIds(), (nodeId) => visNodes.get(nodeId));
        let orderedNodesData = _.sortBy(nodesData, ['level']).reverse();
        let groupsInClusteringOrder = _.map(orderedNodesData, (nodeData) => nodeData.group);
        return groupsInClusteringOrder;
    }

    private componentsToVisNodes(stack: Stack): any {
        let nodes = [];
        for (let component of this.stack.walk()) {
            if (!component.parent) {
                continue;
            }
            nodes.push({
                id: component.id,
                label: component.name,
                level: component.getNestingLevel(),
                group: component.parent.id,
            });
        }
        return new vis.DataSet(nodes);
    }

    private linksToEdgesData(stack: Stack): any {
        let edgesData = [];
        for (let component of this.stack.walk()) {
            for (let link of component.links) {
                edgesData.push({
                    from: component.id,
                    to: link.destinationId,
                });
            }
        }
        return edgesData;
    }

    private hierarchyToEdgesData(stack: Stack): any {
        let edgesData = [];
        for (let component of this.stack.walk()) {
            if (component.parent) {
                edgesData.push({
                    from: component.parent.id,
                    to: component.id,
                    dashes: true,
                    color: {
                        color: 'lightgray',
                        highlight: 'lightgray',
                    }
                });
            }
        }
        return edgesData;
    }

}
</script>
