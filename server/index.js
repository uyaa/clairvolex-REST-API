const cors = require("cors");
const express = require("express");
//const mysql = require("mysql");
const mysql = require("mysql2");

const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(cors());

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(
    `App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`
  );
});

app.get("/books", (req, res) => {
  const page_id = parseInt(req.query.page);
  const sort = req.query.sort ? req.query.sort[0] : false;
  const search = req.query.search ? req.query.search : false;
  let page = page_id ? page_id : 1;

  pool.query(
    `SELECT COUNT(id) as totalCount FROM books ${
      search
        ? `WHERE title LIKE '%${search}%' or author LIKE '%${search}%' or \`publish-date\` LIKE '%${search}%' or genre LIKE '%${search}%'`
        : ""
    }`,
    async (err, result) => {
      // Display 10 items per page
      const perPage = 2,
        totalCount = result[0].totalCount,
        totalPages = Math.ceil(totalCount / perPage);
      // Instantiate Pagination class
      page = totalPages > page ? page : totalPages;
      const offset = page > 1 ? (page - 1) * perPage : 0;
      pool.query(
        `select * from books  ${
          search
            ? `WHERE title LIKE '%${search}%' or author LIKE '%${search}%' or \`publish-date\` LIKE '%${search}%' or genre LIKE '%${search}%'`
            : ""
        } ${
          sort
            ? `ORDER BY \`${sort.field}\` ${
                sort.sort == "asc" ? "ASC" : "DESC"
              }`
            : ``
        } LIMIT ${perPage} OFFSET ${offset}`,
        (err, results) => {
          if (err) {
            console.log(err);
            return res.send(err);
          } else {
            return res.send({
              page,
              per_page: perPage,
              total: totalCount,
              total_pages: totalPages,
              data: results,
            });
          }
        }
      );
    }
  );
});
