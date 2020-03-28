const connection = require("../database/connecion");

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection("incidents").count();

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    const countPage = count["count(*)"] / 5;
    res.header("X-Total-Count", count["count(*)"]);
    res.header("X-Total-Page", countPage);

    res.json(incidents);
  },
  async create(request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const result = await connection("incidents").insert({
      title,
      description,
      value,
      ong_id
    });

    const id = result[0];

    return response.json({ id });
  },
  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    let result = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first();

    if (result.ong_id !== ong_id)
      return response.status(401).json({
        error: "Operation not permitted."
      });

    await connection("incidents")
      .where("id", id)
      .delete();

    return response.status(204).send();
  }
};
