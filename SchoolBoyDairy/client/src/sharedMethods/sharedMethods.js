import UsersService from '../services/UsersService';

    function getTokenFromSessStor(sStorage, tokenKey = 'token') {
        return sStorage.getItem(tokenKey)
    }

    function getRefreshTokenFromSessStor(sStorage, refreshTokenKey = 'refreshToken') {
        return sStorage.getItem(refreshTokenKey)
    }

    async function checkToken(token) {
        const result = await UsersService.checkToken(token)
        return result.body.token
    }

    async function checkRefreshToken(refreshToken) {
        const result = await UsersService.checkRefreshToken(refreshToken)
        return result.body.refreshToken
    }

    export async function checkTokensAndRefrsh(sStorage, router) {
        try {
            const resToken = await checkToken(getTokenFromSessStor(sStorage))
            if (resToken === 'OK'){
                return
            }
        }
        catch (e) {
            try{
                let res = await UsersService.refreshMe(getRefreshTokenFromSessStor(sStorage))
                res = res.data
                sStorage.setItem('token', res.token)
                sStorage.setItem('refreshToken', res.refreshToken)
            }
            catch(e) {
                sStorage.clear()
                router.push({name: 'Login'})
            }
        }
    }