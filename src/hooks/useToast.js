import { createDiscreteApi } from 'naive-ui'
export default () => {
  const { message } = createDiscreteApi(['message'])
  return message
}
