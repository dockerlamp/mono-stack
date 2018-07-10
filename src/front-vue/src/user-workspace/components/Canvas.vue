<template>
    <div>
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
import { Component as StackComponent } from '../../../../common/stack/Component';
import { ComponentType } from '../../../../common/stack/interface/ComponentType';

@Component
export default class Canvas extends Vue {

    public network: vis.Network;

    public stack = new Stack({
        type: ComponentType.Stack,
        name: 'ParentStack',
        children: [
            new StackComponent({
                type: ComponentType.Service,
                name: 'ChildService1',
                children: [
                    new StackComponent({
                        type: ComponentType.Service,
                        name: 'ChildService1.1',
                    }),
                    new StackComponent({
                        type: ComponentType.Service,
                        name: 'ChildService1.2',
                    }),
                ]
            }),
            new StackComponent({
                type: ComponentType.Service,
                name: 'ChildService2',
            }),
        ],
    });

    public componentsToNodes(stack: Stack): any {
        let nodes = [];
        for (let component of this.stack.walk()) {
            nodes.push({
                id: component.id,
                label: component.name,
            });
        }
        return new vis.DataSet(nodes);
    }

    public componentHierarchyToEdges(stack: Stack): any {
        let edges = [];
        for (let component of this.stack.walk()) {
            if (component.parent) {
                edges.push({
                    from: component.parent.id,
                    to: component.id,
                });
            }
        }
        return new vis.DataSet(edges);
    }

    public createNetwork(component: HTMLElement, nodes: any, edges: any): vis.Network {
        let data = {
            nodes: nodes,
            edges: edges,
        };
        let options = {};
        return new vis.Network(component, data, options);
    }

    public mounted(): void {
        let nodes = this.componentsToNodes(this.stack);
        let edges = this.componentHierarchyToEdges(this.stack);
        this.network = this.createNetwork(this.$refs.canvas as HTMLElement, nodes, edges);

        this.network.on('selectNode', (sth: any) => {
            _.map(sth.nodes, (nodeId) => {
                // find component
                for (let component of this.stack.walk()) {
                    if (component.id === nodeId) {
                        this.$emit('componentClicked', component);
                    }
                }
            });
            // _.map(sth.edges, (edgeId) => alert(edgeId));
        });
    }
}
</script>
