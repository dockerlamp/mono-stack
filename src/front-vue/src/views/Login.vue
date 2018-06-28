<template>
    <div id="login-view">
        <Welcome msg="Welcome in DockerLAMP"/>
        <Login/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Welcome from '@/components/Welcome.vue'; // @ is an alias to /src
import Login from '@/components/Login.vue';

@Component({
  components: {
      Welcome,
      Login,
  },
})
export default class LoginView extends Vue {
}
</script>
