exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id").primary()
  table.varchar("image")
  table.text("title")
  table.text("category")
  table.text("price")
  // table.decimal('price', 10, 2)
  table.text("description")
})

exports.down = knex => knex.schema.dropTable("dishes");
