export default class MotorService {
  constructor(resource) {
    this._resource = resource('motors{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(page, query) {
    return this._resource.query({ p: page, q: query }).then(res => res.json());
  }

  save(motor) {
    return this._resource.save(motor);
  }

  edit(id, motor) {
    return this._resource.update({ id }, motor);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
