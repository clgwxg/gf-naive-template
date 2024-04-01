import ajax from "@/utils/ajax"

export const getPostList=(data)=>ajax.get('/post',data)
export const delPost=(id)=>ajax.delete('/post/'+id)
export const addPost=(data)=>ajax.post('/post',data)
export const getPost=(id)=>ajax.get('/post/'+id)
export const updatePost=(data)=>ajax.put('/post',data)