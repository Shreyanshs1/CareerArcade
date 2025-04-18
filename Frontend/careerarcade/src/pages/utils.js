import { toast} from "react-toastify";
//Exoprting the function to show success and error messages
export const handleSuccess=(msg)=>{
    toast.success(msg,{
        position:"top-right"
    })
}

export const handleError=(msg)=>{
    toast.error(msg,{
        position:"top-right"
    })
}