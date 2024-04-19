export const REDEEM_DETAIL = {
    REDEEM_DETAIL_NOT_FOUND: "The redeem detail is not found. Please try again!",
    DELETE_SUCCESS: 'Delete redeem detail successfully!',
    DELETE_FAILED: 'Delete redee, detail failed!',
    OVER_QUANTITY: function (itemName: string, quantity: number) {
        return `The quantity redeem of ${itemName} must be smaller than ${quantity}!`
    },
    OVER_EXPIRED_TIME: function (itemName: string, expiredTime: Date) {
        return `Item ${itemName} is expired from ${expiredTime.getDate()}-${expiredTime.getMonth() + 1}-${expiredTime.getFullYear()}!`
    },
    OUT_OF_STOCK: function (itemName: string) {
        return `Item ${itemName} is out of stock!`
    }
}