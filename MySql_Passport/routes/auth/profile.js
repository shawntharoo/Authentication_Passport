/**
 * User Profile
 *
 * @param req
 * @param res
 */
exports.profile = function (req, res) {
    res.status(200).json(req.user);

};