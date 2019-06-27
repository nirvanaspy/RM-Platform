
import Layout from '@/layout'

const modelerRouter = {
  path: '/flowable-modeler',
  component: Layout,
  name: 'flowable-modeler',
  redirect: '/flowable-modeler/processes',
  children: [
    {
      path: 'processes',
      component: () => import('@/views/flowable/index'),
      name: 'processes',
      meta: { title: 'processes', icon: 'tree', root: 'modeler', page: 'processes' }
    },
    {
      path: 'casemodels',
      component: () => import('@/views/flowable/index'),
      name: 'casemodels',
      meta: { title: 'casemodels', icon: 'example', root: 'modeler', page: 'casemodels' }
    },
    {
      path: 'forms',
      component: () => import('@/views/flowable/index'),
      name: 'forms',
      meta: { title: 'forms', icon: 'form', root: 'modeler', page: 'forms' }
    },
    {
      path: 'decision-tables',
      component: () => import('@/views/flowable/index'),
      name: 'decision-tables',
      meta: { title: 'decision-tables', icon: 'guide', root: 'modeler', page: 'decision-tables' }
    },
    {
      path: 'apps',
      component: () => import('@/views/flowable/index'),
      name: 'apps',
      meta: { title: 'apps', icon: 'star', root: 'modeler', page: 'apps' }
    }
  ]
}
export default modelerRouter
