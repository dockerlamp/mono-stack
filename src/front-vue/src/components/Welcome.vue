<template>
    <div id="welcome-component">
        <h1>{{msg}}</h1>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Welcome extends Vue {
  @Prop() private msg!: string;
}
</script>


<style lang="scss">
#welcome {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #35aa45;
}
</style>