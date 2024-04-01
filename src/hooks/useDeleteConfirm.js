import { useDialog,useMessage  } from 'naive-ui'
export default (deleteFn)=>{
  const dialog=useDialog()
  const message = useMessage()
  return (params)=>{
    return new Promise((resolve)=>{
      dialog.warning({
        title: '提示',
        showIcon:false,
        content: '确认删除吗？',
        positiveButtonProps:{type:"primary"},
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          let res=null
         if(typeof deleteFn=='function'){
           res=await deleteFn(params)
           if(res?.code===2000){
             message.success(res?.msg||'删除成功')
           }else{
             message.error(res?.msg || '删除失败')
           }
         }
         resolve(res)
        },
        onNegativeClick: () => {
          resolve()
        }
      })
    })
    
   
  }
}