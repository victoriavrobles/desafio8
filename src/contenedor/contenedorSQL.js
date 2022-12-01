
export class Contenedor {
  constructor(connection, table) {
    this.connection = connection;
    this. table = table;
  }

  async save(objeto) {
    await this.connection(this.table).insert(objeto);
  }

  async getById(id) {
    return await this.connection(this.table).where('id', id);
  }

  async getAll() {
    return await this.connection(this.table);
  }

  async deleteById(id) {
    await this.connection(this.table).where('id', id).del();
  }

  async deleteAll() {
await this.connection(this.table).del();
}
}