export default class vibrationService {
  constructor(resource) {
    this._resource = resource('vibrations{/id}{?q,p}');
  }

  get(id) {
    return this._resource.get({ id }).then(res => res.json());
  }

  listAll(page, query) {
    return this._resource.query({ p: page, q: query }).then(res => res.json());
  }

  save(vibration) {
    return this._resource.save(vibration);
  }

  edit(id, vibration) {
    return this._resource.update({ id }, vibration);
  }

  delete(id) {
    return this._resource.delete({ id });
  }
}
