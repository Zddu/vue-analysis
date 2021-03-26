class Dep{
  constructor(){
    this.deps = [];
  }

  addDep(key){
    this.deps.push(key);
  }

  notify(){
    this.deps.forEach(dep=> dep.update())
  }
}