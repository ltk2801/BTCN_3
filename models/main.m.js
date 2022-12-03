const { pgp, db } = require("../config/postgres");

exports.Signin = async function (account) {
  // console.log("account");
  const rs = await db.any(
    `insert into public.\"Users\"(\"f_ID\",\"f_Email\", \"f_Password\", \"f_Name\", \"f_DOB\") 
        VALUES ($1, $2, $3, $4, $5) returning *`,
    [account.id, account.email, account.password, account.name, account.dob]
  );
  return rs;
};

exports.findEmail = async function (email) {
  const rs = await db.any('select * from public."Users"where"f_Email"like $1', [
    email,
  ]);
  return rs;
};

exports.getLastID = async function () {
  const accounts = await db.any('select * from public."Users"');
  // console.log(accounts[accounts.length - 1].f_ID);
  if (accounts.length == 0) {
    return 0;
  }
  return accounts[accounts.length - 1].f_ID;
};
