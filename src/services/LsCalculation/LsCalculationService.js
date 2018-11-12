export default class LsCalculationService {
  constructor(resource) {
    this._resource = resource('lscalculations{/id}{?q,p}');
  }

  calculate(body) {
    return this._resource.save(body);
  }
}
