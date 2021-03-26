
class Watcher{
  constructor(vm,key,cb){
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    //触发依赖收集
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  update(){
    this.cb.call(this.vm,this.vm[this.key]); //指向Vue实例对象
  }
}
