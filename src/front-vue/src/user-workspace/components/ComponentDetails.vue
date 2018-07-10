<template>
    <div>
        <div id="componentDetails"></div>
        <h2>component details:</h2>
        <form>
            <p> id: {{component.id}} </p>
            name: <input v-model="component.name" placeholder="component.name">
            <p> type: {{component.type}} </p>
            <p> object: {{component}} </p>
        </form>
    </div>
</template>

<script lang="ts">
import * as _ from 'lodash';

import vis from 'vis';

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Component as StackComponent } from '../../../../common/stack/Component';
import { ComponentType } from '../../../../common/stack/interface/ComponentType';
import { Stack } from '../../../../common/stack/Stack';

@Component({})
export default class ComponentDetails extends Vue {
    // @refresh component in vis network
    @Prop() public component: StackComponent;
}
</script>
