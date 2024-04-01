import ajax from "@/utils/ajax"

export const getEmpList=(data)=>ajax.get('/emp',data)
export const delEmp=(id)=>ajax.delete('/emp/'+id)
export const addEmp=(data)=>ajax.post('/emp',data)
export const getEmp=(id)=>ajax.get('/emp/'+id)
export const updateEmp=(data)=>ajax.put('/emp',data)