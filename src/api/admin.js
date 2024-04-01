import ajax from "@/utils/ajax"

export const login=(data)=>ajax.post("/login",data)

export const getAdminInfo=()=>ajax.get("/info")
export const adminLogout=()=>ajax.get("/logout")