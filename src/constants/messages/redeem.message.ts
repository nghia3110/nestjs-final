export const REDEEM = {
    REDEEM_NOT_FOUND: "The redeem is not found. Please try again!",
    DELETE_SUCCESS: 'Delete redeem successfully!',
    DELETE_FAILED: 'Delete redeem failed!',
    STATUS_NOT_CHANGED: 'Please change the redeem status!',
    REDEEM_ALREADY_SUCCESS: 'This redeem is already success!',
    COMPLETE_REDEEM_FAILED: function (userPoint: number, totalPoints: number) {
        return `Your point is ${userPoint}. This is not enough for your redeem (${totalPoints})!`
    },
    COMPLETE_REDEEM_SUCCESS: 'Complete redeem successfully!',
    NOT_ENOUGH_ITEM: 'Please add at least 1 item for the order!'
}