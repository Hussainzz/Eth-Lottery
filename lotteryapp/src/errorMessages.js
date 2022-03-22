const messages = {
    "invalidFee()":"Please enter a valid entry fee"
}

const eventMessages = {
    "NewLotteryPlayer":"You have successfully entered the lottery"
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