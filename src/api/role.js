import ajax from "@/utils/ajax"

export const getRoleList=(data)=>ajax.get('/role',data)
export const delRole=(id)=>ajax.delete('/role/'+id)
export const addRole=(data)=>ajax.post('/role',data)
export const getRole=(id)=>ajax.get('/role/'+id)
export const updateRole=(data)=>ajax.put('/role',data)