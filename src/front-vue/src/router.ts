import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import VisView from './views/Vis.vue';
import VisWorkspace from './user-workspace/views/VisWorkspace.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/workspace',
            name: 'user-workspace',
            component: VisWorkspace,
        },
    ],
});
