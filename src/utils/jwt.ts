import jwt from 'jsonwebtoken'

export function decodeTokenId(tokenId: string): string {
    const decodedToken = jwt.decode(tokenId);

    return decodedToken?.sub as string
}