const { pgp, db } = require("../config/postgres");
const filmM = require("../models/film");

exports.Signin = async function (account) {
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
  if (accounts.length == 0) {
    return 0;
  }
  return accounts[accounts.length - 1].f_ID;
};

exports.getLastIDM = async function () {
  const rs = await db.any('select * from public."UserFavoriteMovies"');
  if (rs.length == 0) {
    return 0;
  }
  return rs[rs.length - 1].ID;
};

exports.findIDM = async function (idm, idu) {
  const rs = await db.any(
    'select * from public."UserFavoriteMovies" where "ID_film" = $1 and "ID_User" = $2',
    [idm, idu]
  );

  return rs;
};

exports.AddFavorite = async function (tamp) {
  const rs = await db.any(
    `insert into public.\"UserFavoriteMovies\"(\"ID\",\"ID_User\", \"ID_film\")
  VALUES ($1, $2, $3) returning *`,
    [tamp.id, tamp.idU, tamp.idM]
  );
  return rs;
};

exports.getMovie = async function (idU) {
  const rs = await db.any(
    'select * from public."UserFavoriteMovies" where "ID_User" = $1',
    [idU]
  );

  return rs;
};

exports.getArrMovie = async function (arr) {
  const movies = arr.map(async (obj) => {
    const data = await filmM.findIdMovie(obj.ID_film);

    return data[0];
  });
  return Promise.all(movies);
};

exports.deleteMovie = async function (idU, idM) {
  const rs = await db.any(
    'delete from public."UserFavoriteMovies" where "ID_film" = $1 and "ID_User" = $2',
    [idM, idU]
  );
  return rs;
};
