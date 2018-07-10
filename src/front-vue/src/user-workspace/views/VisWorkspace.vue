<template>
    <div id="vis-workspace">
        <Canvas @componentClicked="onComponentClick"/>
        <ComponentDetails :component="component"/>
    </div>
</template>

<script lang="ts">
import vis from 'vis';

import { Component as StackComponent } from '../../../../common/stack/Component';

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Canvas from '@/user-workspace/components/Canvas.vue';
import ComponentDetails from '@/user-workspace/components/ComponentDetails.vue';

@Component({
    components: {
        Canvas,
        ComponentDetails,
    },
})
export default class VisWorkspace extends Vue {

    public component: StackComponent = null;

    public onComponentClick(component: StackComponent) {
        // alert(component.name);
        this.component = component;
    }
}
</script>