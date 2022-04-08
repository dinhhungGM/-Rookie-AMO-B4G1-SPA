export default function(object) {
    var queryString = "";
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
        queryString += key + "=" + object[key] + "&";
        }
    }
    return queryString;
}
