const  CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserID) => {
//     console.log(requestUser);
//     console.log(resourceUserID);
//     console.log(typeof resourceUserID);
if(requestUser.role ==='admin') return;
if(requestUser.userId  === resourceUserID.toString()) return;
throw new CustomError.UnauthorizedError(
    'Not authorized to access this route');
    // (alias) const export =: (requestUser: any, resourceUserId)
}

module.exports = checkPermissions;