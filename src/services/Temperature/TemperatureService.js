export default class TemperatureService {
  constructor(resource) {
    this._resource = resource('temperatures{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(page, query) {
    return this._resource.query({ p: page, q: query }).then(res => res.json());
  }

  save(temperature) {
    return this._resource.save(temperature);
  }

  edit(id, temperature) {
    return this._resource.update({ id }, temperature);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
