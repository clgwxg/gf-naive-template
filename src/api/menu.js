import ajax from "@/utils/ajax"

export const getMenuList=(data)=>ajax.get('/menu',data)
export const delMenu=(id)=>ajax.delete('/menu/'+id)
export const addMenu=(data)=>ajax.post('/menu',data)
export const getMenu=(id)=>ajax.get('/menu/'+id)
export const updateMenu=(data)=>ajax.put('/menu',data)