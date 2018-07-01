<template>
    <div id="vis-view">
        <Network/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Network from '@/components/Network.vue';

@Component({
  components: {
      Network,
  },
})
export default class VisView extends Vue {
}
</script>
