<template>
    <div id="network" ref="network">
    </div>
</template>


<style lang="scss">
#network {
            width: 600px;
            height: 400px;
            border: 1px solid lightgray;
        }
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import vis from 'vis';

@Component
export default class Network extends Vue {

    // create an array with nodes
    public nodes: any = new vis.DataSet([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'},
    ]);

    // create an array with edges
    public edges: any = new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5},
    ]);

    // provide the data in the vis format
    public data: object = {
        nodes: this.nodes,
        edges: this.edges,
    };

    public options: object = {
        manipulation: {
            enabled: true,
            addNode: (nodeData: any, callback: any) => {
                nodeData.label = 'pablo';
                callback(nodeData);
            },
        },
    };

    public network: any;

    public mounted(): void {
        this.network = new vis.Network(this.$refs.network as HTMLElement, this.data, this.options);
    }
}
</script>
