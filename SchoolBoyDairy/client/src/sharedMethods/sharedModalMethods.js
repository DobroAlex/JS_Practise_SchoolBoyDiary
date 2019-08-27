let modalInstanceStorage = undefined

export function getModalFromThis(thisInstance) {
    return thisInstance.$modal
}

export function registerModal(modalInstance) {
    modalInstanceStorage = modalInstance
}

export function showModal (modalWinName) {
    modalInstanceStorage.show(modalWinName)
}

export function hideModal (modalWinName) {
    modalInstanceStorage.hide(modalWinName)
}