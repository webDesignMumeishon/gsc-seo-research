"use server"
import prisma from "../../lib/prisma"
import TokenService from '@/services/token';
import { cachedGetSiteToken } from "./cached";


export async function GetSiteToken(userId: string, siteUrl: string) {
    return prisma.site.findFirst({
        where: {
            userId,
            url: siteUrl
        },
        include: {
            token: true
        },
    });
}

export async function GetUserToken(userId: string, siteUrl: string): Promise<{
    id: number;
    subId: string;
    expiry_date: Date;
    access_token: string;
    refresh_token: string;
    userId: string;
}> {
    const site = await cachedGetSiteToken(userId, siteUrl)

    if (site?.token !== undefined) {
        return TokenService.refreshToken(site.token)!
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

