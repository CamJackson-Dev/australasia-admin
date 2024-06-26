export const getUuid = (length: number) => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    var result = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }
    return result;
};
