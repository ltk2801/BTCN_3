const { pgp, db } = require("../config/postgres");

const dataFilm = require("../data/movies.json");
const dataCast = require("../data/casts.json");

exports.addDataFilms = async function () {
  const haveData = await db.any('select * from public."Films"');
  if (haveData.length == 0) {
    dataFilm.map(async (data) => {
      let hasProfanity = null;
      let language = null;
      let text = null;
      if (data.synopses) {
        hasProfanity = data.synopses.hasProfanity;
        language = data.synopses.language;
        text = data.synopses.text;
      }
      const rs = await db.any(
        `insert into public.\"Films\"(\"id\",\"img\", \"title\", \"year\", \"topRank\", \"rating\", \"ratingCount\",\"genres\",\"hasProfanity\",\"language\",\"text\")
                              VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11) returning *`,
        [
          data.id,
          data.img,
          data.title,
          data.year,
          data.topRank,
          data.rating,
          data.ratingCount,
          data.genres,
          hasProfanity,
          language,
          text,
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

exports.addDataFilmCasts = async function () {
  const haveData = await db.any('select * from public."FilmsCasts"');
  if (haveData.length == 0) {
    dataFilm.map(async (data) => {
      let idC = "";
      let nameC = "";
      let charactersC = "";
      // console.log(data.casts.length !== 0);
      if (data.casts.length != 0) {
        data.casts.map(async (dataC) => {
          idC = dataC.id;
          nameC = dataC.name;
          charactersC = dataC.characters;

          const rs = await db.any(
            `insert into public.\"FilmsCasts\"(\"ID_film\", \"ID_cast\", \"name_cast\", \"characters_cast\")
                                  VALUES ($1, $2, $3, $4) returning *`,
            [data.id, idC, nameC, charactersC]
          );
        });
      }
    });
  }
};

exports.addDataFilmReview = async function () {
  const haveData = await db.any('select * from public."FilmsReviews"');
  if (haveData.length == 0) {
    dataFilm.map(async (data) => {
      if (data.reviews.length != 0) {
        // console.log(data.reviews);
        data.reviews.map(async (dataR) => {
          let up = 0;
          let down = 0;
          const { interestingVotes } = dataR;
          if (interestingVotes && Object.keys(interestingVotes).length !== 0) {
            if (interestingVotes.down) {
              down = interestingVotes.down;
            }
            if (interestingVotes.up) {
              up = interestingVotes.up;
            }
          }

          const rs = await db.any(
            `insert into public.\"FilmsReviews\"(\"ID_film\", \"name_author\", \"authorRating\", \"helpfulnessScore\", \"interestingVotes_D\", \"interestingVotes_U\", \"reviewText\", \"reviewTitle\", \"submissionDate\")
                                  VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9) returning *`,
            [
              data.id,
              dataR.author,
              dataR.authorRating,
              dataR.helpfulnessScore,
              down,
              up,
              dataR.languageCode,
              dataR.reviewText,
              dataR.reviewTitle,
              dataR.submissionDate,
            ]
          );
        });
      }
    });
  }
};

exports.getDataFilmComing = async function () {
  const rs = await db.any(
    'select * from public."Films" order by rating desc limit 7'
  );
  return rs;
};

exports.getDataFilmRating = async function () {
  const rs = await db.any(
    'select * from public."Films" order by rating  limit 40'
  );
  return rs;
};

exports.findIdMovie = async function (id) {
  const rs = await db.any('select * from public."Films"where"id"like $1', [id]);
  return rs;
};
