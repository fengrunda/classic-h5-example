import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      alias: '/',
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/page1/:idPage1',
      name: 'page1-container',
      redirect: { name: 'page1-detail' },
      component: () => import('@/components/Container.vue'),
      children: [
        {
          path: '',
          name: 'page1-detail',
          component: () => import('@/views/page1/index.vue')
        },
        {
          path: 'page2/:idPage2',
          name: 'page2-container',
          redirect: { name: 'page2-detail' },
          component: () => import('@/components/Container.vue'),
          children: [
            {
              path: '',
              name: 'page2-detail',
              component: () => import('@/views/page1/page2/index.vue')
            },
            {
              path: 'page3/:idPage3',
              name: 'page3-container',
              redirect: { name: 'page3-detail' },
              component: () => import('@/components/Container.vue'),
              children: [
                {
                  path: '',
                  name: 'page3-detail',
                  component: () => import('@/views/page1/page2/page3/index.vue')
                }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   path: '/page1/:idPage1',
    //   name: 'page1',
    //   props: true,
    //   component: () => import('@/views/page1/index.vue')
    // },
    // {
    //   path: '/page1/:idPage1/page2/:idPage2',
    //   name: 'page2',
    //   props: true,
    //   component: () => import('@/views/page1/page2/index.vue')
    // },
    // {
    //   path: '/page1/:idPage1/page2/:idPage2/page3/:idPage3',
    //   name: 'page3',
    //   props: true,
    //   component: () => import('@/views/page1/page2/page3/index.vue')
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/three',
      name: 'three',
      component: () => import(/* webpackChunkName: "three" */ './views/Three.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import(/* webpackChunkName: "loading" */ './components/Loading.vue')
    },
    { path: '*', redirect: '/' }
  ]
})
