// tree 深度查找某个数据
export const deepFind=(list,keyField,value)=>{
  let item=undefined
  list.forEach(element => {
     if(element.children){
      let temp=deepFind(element.children,keyField,value)
      if(temp){
        item=temp
      }
    }
    if(element[keyField]==value){
      item=element
    }
  })
  return item
}
