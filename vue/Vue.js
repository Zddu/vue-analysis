class Vue{
  constructor(options){
    //保存该选项
    this.$options = options;

    //保存data
    this.$data = options.data;

    this.observe(this.$data);

    new Compile(options.el,this);

    //hook
    if (options.created) {
      options.created.call(this);
    }
  }

  observe(value){
    if(!value || typeof value !== 'object' ){
      return;
    }

    //遍历value
    Object.keys(value).forEach(key=>{
      //数据代理
      this.proxyData(key);
      //响应式数据
      this.defineReactive(value,key,value[key])
    })
  }

  defineReactive(obj,key,val){
    this.observe(val);

    //挂载依赖收集器
    const dep = new Dep();

    //给data中的每一个key定义拦截
    Object.defineProperty(obj,key,{
      get(){
        //Dep.target 保存watcher 实例
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal){
        if(newVal!==val){
          val = newVal;
          dep.notify();
        }
      }
    })
  }

  proxyData(key){
    if(!this.$data[key]){
      return;
    }
    Object.defineProperty(this,key,{
      get(){
        return this.$data[key];
      },
      set(newVal){
        if(newVal === this.$data[key]) return;
        this.$data[key] = newVal;
      }
    })
  }
}


