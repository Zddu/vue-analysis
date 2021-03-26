class Compile {
  constructor(el,vm){
    this.$vm = vm;
    this.$el = document.querySelector(el);
    //把模板中内容移到片段操作
    this.$fragment = this.node2Fragment(this.$el);
    //执行编译
    this.compile(this.$fragment);
    //放回el中
    this.$el.appendChild(this.$fragment);

  }

  node2Fragment(el){
    //创建文档片段
    const fragment = document.createDocumentFragment();
    let child;
    while(child = el.firstChild){
      fragment.appendChild(child);
    }
    return fragment;
  }

  compile(el){
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node=>{
      if(node.nodeType === 1){
        this.compileElement(node);
      }else if (this.isInter(node)) {
        this.compileText(node);
      }
      if (node.children && node.childNodes.length > 0) {
        this.compile(node);
      }
    })
  }
  isInter(node){
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileElement(node){
    //获取元素的所有属性
    const nodeAttrs = node.attributes;
    [].slice.call(nodeAttrs).forEach(attr=>{
      const attrName = attr.name;
      const exp = attr.value;
      if (attrName.indexOf("k-")===0){
        const dir = attrName.substring(2);
        this[dir] && this[dir](node,exp);
      }
      if(attrName.indexOf("@")===0){
        const dir = attrName.substring(1); //@click ==> click
        this.eventHandle(node,this.$vm,exp,dir);//exp ==> @click="submit" ===> submit
      }
    })
  }

  compileText(node){
    const exp = RegExp.$1;
    this.update(node,exp,"text");
  }

  update(node,exp,dir){
    const updater = this[dir+"Updater"];
    updater && updater(node,this.$vm[exp]);
    new Watcher(this.$vm,exp,function (value) {
      updater && updater(node,value);
    })
  }

  eventHandle(node,vm,exp,dir){
    //获取需要调用的函数
    //dir click
    //exp changeName
    let fn = vm.$options.methods && vm.$options.methods[exp];
    //给fn绑定Vue实例，确保this指向正确
    node.addEventListener(dir,fn.bind(vm));
  }

  textUpdater(node,value){
    node.textContent = value;
  }

  htmlUpdater(node,value){
    node.innerHTML = value;
  }

  modelUpdater(node,value){
    node.value = value
  }

  text(node,exp){
    this.update(node,exp,'text')
  }

  html(node,exp){
    this.update(node,exp,'html');
  }

  model(node,exp){
    this.update(node,exp,'model');
    node.addEventListener('input',e=>{
      this.$vm[exp] = e.target.value;
    })
  }
}
