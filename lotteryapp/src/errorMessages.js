const messages = {
    "invalidFee()":"Please enter a valid entry fee",
    "lotteryNotFound()": "Lottery Does Not Exist",
    "lotteryFull()": "Lottery Full"
}

const eventMessages = {
    "LotteryCreated": "New Lottery Has Been Created Successfully",
    "NewLotteryPlayer":"You have successfully entered the lottery",
    "RandomnessRequested" : "Winner will be announced within 60secs"
}

export const getEMessage = (message) => {
    const errorKey = message.match(/\w+\(\)/g);
    if(errorKey !== null){
        if(messages[errorKey[0]]){
            return messages[errorKey[0]];
        }
    }
    return message;   
}

export const eventMessage = (eve) => {
    if(eventMessages[eve]){
        return eventMessages[eve];
    }
    return eve;
}