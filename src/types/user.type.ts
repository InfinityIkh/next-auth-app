import { updateUserSchema, userSchema } from "@/validation/user.validation"
import z from "zod"

export type CreateUserInput = z.infer<typeof userSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type UserType = {
    id : number
    username : string
    email : string
    role : string
    created_at : Date
}

export type UserIdParams = {
    params : Promise<{id : string}>
}