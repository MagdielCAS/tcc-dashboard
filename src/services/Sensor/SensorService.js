export default class SensorService {
  constructor(resource) {
    this._resource = resource('sensors{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(query) {
    return this._resource.query(query).then(res => res.json());
  }

  save(sensor) {
    return this._resource.save(sensor);
  }

  edit(id, sensor) {
    return this._resource.update({ id }, sensor);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
