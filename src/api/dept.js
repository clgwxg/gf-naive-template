import ajax from "@/utils/ajax"

export const getDeptList=(data)=>ajax.get('/dept',data)
export const delDept=(id)=>ajax.delete('/dept/'+id)
export const addDept=(data)=>ajax.post('/dept',data)
export const getDept=(id)=>ajax.get('/dept/'+id)
export const updateDept=(data)=>ajax.put('/dept',data)