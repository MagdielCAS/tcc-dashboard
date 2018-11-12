export default class ReadingService {
  constructor(resource) {
    this._resource = resource('readings{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(query) {
    return this._resource.query(query).then(res => res.json());
  }

  save(reading) {
    return this._resource.save(reading);
  }

  edit(id, reading) {
    return this._resource.update({ id }, reading);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
