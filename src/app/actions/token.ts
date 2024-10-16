"use server"
import prisma from "../../lib/prisma"
import TokenService from '@/services/token';
import jwt from 'jsonwebtoken'


export async function GetUserToken(userId: string, siteUrl: string) {
    const site = await prisma.site.findFirst({
        where: {
            userId,
            url: siteUrl
        },
        include: {
            token: true
        },
    });

    if (site?.token !== undefined) {
        TokenService.refreshToken(site.token)
        return site.token
    }
    else {
        throw new Error('Missing token')
    }
}

export async function GetUserTokenByTokenId(subId: string) {
    const token = await prisma.token.findFirst({
        where: {
            subId
        },
    });

    if (token === null) {
        throw new Error('Missing token')
    } else {
        return token
    }
}

