const { pgp, db } = require("../config/postgres");

const dataFilm = require("../data/movies.json");
const dataCast = require("../data/casts.json");

exports.addDataFilms = async function () {
  const haveData = await db.any('select * from public."Films"');
  if (haveData.length == 0) {
    dataFilm.map(async (data) => {
      const rs = await db.any(
        `insert into public.\"Films\"(\"id\",\"img\", \"title\", \"year\", \"topRank\", \"rating\", \"ratingCount\",\"genres\")
                            VALUES ($1, $2, $3, $4,$5,$6,$7,$8) returning *`,
        [
          data.id,
          data.img,
          data.title,
          data.year,
          data.topRank,
          data.rating,
          data.ratingCount,
          data.genres,
        ]
      );
    });
  }
};

exports.addDataCasts = async function () {
  const haveData = await db.any('select * from public."Casts"');
  if (haveData.length == 0) {
    dataCast.map(async (data) => {
      const rs = await db.any(
        `insert into public.\"Casts\"(\"id\",\"img\", \"legacyNameText\", \"name\", \"birthDate\", \"birthPlace\", \"gender\",\"heightCentimeters\",\"nicknames\",\"realName\")
                              VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) returning *`,
        [
          data.id,
          data.image,
          data.legacyNameText,
          data.name,
          data.birthDate,
          data.birthPlace,
          data.gender,
          data.heightCentimeters,
          data.nicknames,
          data.realName,
        ]
      );
    });
  }
};
