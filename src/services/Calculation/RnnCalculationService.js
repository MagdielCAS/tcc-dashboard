export default class RnnCalculationService {
  constructor(resource) {
    this._resource = resource('rnncalculations{/id}{?q,p}');
  }

  calculate(body) {
    return this._resource.save(body);
  }
}
