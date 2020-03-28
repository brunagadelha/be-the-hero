const connection = require("../database/connecion");

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    var ong = await connection("ongs")
      .where("id", id)
      .select("name")
      .first();

    if (!ong) response.status(400).json({ error: "No ONG found with this ID" });

    return response.json(ong);
  }
};
