export const REDEEM_DETAIL = {
    REDEEM_DETAIL_NOT_FOUND: "The order detail is not found. Please try again!",
    DELETE_SUCCESS: 'Delete order detail successfully!',
    DELETE_FAILED: 'Delete order detail failed!',
    OVER_QUANTITY: function (itemName: string, quantity: number) {
        return `The quantity redeem of ${itemName} must be smaller than ${quantity}!`
    }
}