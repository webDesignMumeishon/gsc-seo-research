"use server"
import prisma from "../lib/prisma"

export async function GetUserToken(userId: number) {
    return await prisma.token.findFirst({
        where: {
            userId
        },
    })
}