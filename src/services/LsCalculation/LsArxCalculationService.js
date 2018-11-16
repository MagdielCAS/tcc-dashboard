export default class LsArxCalculationService {
  constructor(resource) {
    this._resource = resource('lsarxcalculations{/id}{?q,p}');
  }

  calculate(body) {
    return this._resource.save(body);
  }
}
