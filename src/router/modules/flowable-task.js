
import Layout from '@/layout'

const taskRouter = {
  path: '/flowable-task',
  component: Layout,
  name: 'flowable-task',
  redirect: '/flowable-task/index',
  meta: { title: '任务管理', icon: 'example' },
  children: [
    {
      path: 'myToDo',
      component: () => import('@/views/flowable/index'),
      name: 'myToDo',
      alwaysShow: true,
      meta: { title: 'myToDo', icon: 'myToDo' }
    },
    {
      path: 'waitMeDo',
      component: () => import('@/views/flowable/index'),
      name: 'waitMeDo',
      meta: { title: 'waitMeDo', icon: 'waitMeDo' }
    },
    {
      path: 'taskAll',
      component: () => import('@/views/flowable/index'),
      name: 'taskAll',
      meta: { title: 'taskAll', icon: 'taskAll' }
    }
  ]
}
export default taskRouter
