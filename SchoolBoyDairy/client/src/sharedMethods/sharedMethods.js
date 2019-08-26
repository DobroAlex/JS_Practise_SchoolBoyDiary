import UsersService from '../services/UsersService';
    export async function refreshToken(token) {
        try{
            alert(`1 ${token}`)
            const response = await UsersService.refreshMe(token)
            return response.data
        }
        catch(e) {
            throw e
        }
    }
    
    export async function checkTokensAndRefresh(sStorage) {
        try{
            alert(sStorage.getItem('refreshToken'))
            await UsersService.checkToken(sStorage.getItem('token'))
        }
        catch(e) {
            try {
                alert(sStorage.getItem('refreshToken'))
                await UsersService.checkRefreshToken(sStorage.getItem('refreshToken'))
                const refresh = await refreshToken(sStorage.getItem('refreshToken'))
                sStorage.setItem('token', refresh.token)
                sStorage.setItem('refreshToken', refresh.refreshToken)
            }
            catch(e) {
                throw e
            }
        }
    }