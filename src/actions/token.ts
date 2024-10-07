"use server"
import prisma from "../lib/prisma"

export async function GetUserToken(userId: number) {
    const token = await prisma.token.findFirst({
        where: {
            userId
        },
    })
    if (token === null) {
        throw new Error('Missing token')
    }else{
        return token
    }
}