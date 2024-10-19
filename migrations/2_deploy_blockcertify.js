const BlockCertify = artifacts.require("BlockCertify");

module.exports = function (deployer) {
    deployer.deploy(BlockCertify);
};
