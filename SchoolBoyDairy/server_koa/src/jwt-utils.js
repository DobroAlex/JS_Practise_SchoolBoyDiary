const jwt = require('jsonwebtoken')
module.exports = {
  newAccesssToken: function ({ email, role }) {
    return jwt.sign({ email, role }, this.JWT_SECRET, { expiresIn: this.defaultExpireTime })
  },
  verifyAccessToken: function (token) { // both this and upper officialy stolen from @SinaniG1996, many thanks
    return jwt.verify(token, this.JWT_SECRET, { expiresIn: this.defaultExpireTime })
  },
  getTokenFromHeader: function (context) {
    if (!context.request.header.authorization || !context.request.header.authorization.includes('Bearer')) {
      context.status = 400
      throw new Error('Requset dosen\'t contains token')
    }
    return context.request.header.authorization.split('Bearer')[1].trim()
  },
  defaultExpireTime: '30m',
  JWT_SECRET: 'd908e5fb5a41f3e9b7a0c1b422f4414635c9b4e2c6f2ca2958fb11b91fe310a0bc4795a539260b60' + // 1024 bytes of randomness
  'b81a108d011c9e241bcc9627ad08355defaef1660f2bed51fbb810bed0cd759eb519b83fe633a50e' +
  '74e3a6465224ca23f2bfbb50c8edaa84864a8be1b0cea799352fe11dad0bf73660c924c97bef82bf' +
  'f91446624ce810016ef6277da9c5017cf9f62b0d6c476e6a83efe163f06f0233284bcdca205b8ca7' +
  '4f7ac2ee214b656483554b2d0245c27c266bd81f0fe6a8cc177e1c480cb36319d22c8bac3127a414' +
  '6595667fe5428c50bf87d832f6fa54caaf7aaf4e89f08173963f6fb72ddc3445fe771e1194f51377' +
  'ae3af4f21877b106bef64a3aeb88540892b98ffa9495e04441d786cdec7d477619768608639ab83e' +
  '9c0b7b59b5793a89f11f67e0f179b32e160a2f8432969f0e067913bac0954a375ad7bcf1130a90bb' +
  '4fc5fecc57a262c08ffd9170bee70d74b0757f7a84807e6161bb3b1a157935d06a4fc63bca51d253' +
  'c2c6fd679b4b3bc4133804aa1df6eb837d4884bf17c38c4efb589a15913e4f8b90638d7076bb88d4' +
  '3149e29602ea84801f40478e9647741815d05e4a70136574eda262c395118f93cd61359dfe450e66' +
  'f70a817f3a5748094efb38491ebc03f0071f4cfd88e45c58684d6881721a8e7262101a260f013bcf' +
  '4c257ffc0800984d47d245690901d9e1de3a1d27282a6a4553938d9097bcf1badaaa4fe6ae6ab6fa' +
  'ab3de8266c9cf37ae4e2c6c9a18d554d9eb5fc99771f01ef2bf6befcbd8cbb05068c08aacd85c200' +
  '9b6317ebad7d2d4d35799daa006a5599d1dd92c34152620e6c64b5f5c32182eeb9933d3c89509bbf' +
  '49e7c9f3f1bf828aca9fa9352346e42098423230fa60b76bc253712cdaa022f7747e48a012e1e46e' +
  '430a2bfa19d288998d33d43d0d9449e2685dc3ce928a98c405d02bfdb9db42a6b333995928ae23ad' +
  '0b58baf03f981f1d9321844b7e0ab254e8571d639b7fcf4bc496dca0ddb73d5e009205763d3e707b' +
  'df21c983c8bfa47faf5b79156d7695313a58359f5ac43ff43eeab6519489315bfe4ae0545f5d948a' +
  'ba5f3952260c072e47da7c41c594c33d3f213eff0461baf4537c1360e7d4d027f9ce338f7da20ee1' +
  'ee9d1653731c108ad7dca0ad58b56bca1b3cc2099e54549a94fa425c96186e2688036dda3525b7fb' +
  '56ca35733401ab3ddfcfe133ca8937b3bd4b354be9dd13179f83c4e717f51dad2fb80280722a1595' +
  'a2b4673e0321e325bb9a00108ffb5d46bd573c2998c32a10ce66c2b1ed9ec55889da063737de8f11' +
  '70212c31c5a55828d288232c32b9208da1ca0f8a177c78ba5d7648b9a1cbbc97431013d5f87a85de' +
  '663952231a970258bd96ad4634d3ae348ad50f4a624cb99ae6f864ece45fbd6300b13fb00b77ed7f' +
  '8caba45a9771090e9cf07f2433ae2429959baeed4e1d0ec8'
}
