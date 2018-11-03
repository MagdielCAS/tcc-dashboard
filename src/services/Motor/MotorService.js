export default class TemperatureService {
  constructor(resource) {
    this._resource = resource('motors{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(page, query) {
    return this._resource.query({ p: page, q: query }).then(res => res.json());
  }

  save(patient) {
    return this._resource.save(patient);
  }

  edit(id, patient) {
    return this._resource.update({ id }, patient);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
