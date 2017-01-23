module powerbi.extensibility.visual {
    const nonAcceptedNodes = [
        'META',
    ];

  export function ParseElement(el: HTMLElement , target: HTMLElement) : Node[]
  {
    let arr: Node[];
    let nodes = el.children;
    for (var i=0; i<nodes.length; i++)
    {
        
      if (nonAcceptedNodes.indexOf(nodes.item(i).nodeName)!=-1){
        continue;
      }
      console.log(nodes[i].nodeName);

      let tempNode: HTMLElement; 
      if (nodes.item(i).nodeName == 'SCRIPT'){
        tempNode = createScriptNode(nodes.item(i));
      }else{
        tempNode = <HTMLElement>nodes.item(i).cloneNode(true);  
      }
      target.appendChild(tempNode);
      arr.push(tempNode);
    }
    return arr;
  }
  
  function createScriptNode(refNode: Element): HTMLElement{
    let script: HTMLScriptElement = document.createElement('script');
    let attr: NamedNodeMap = refNode.attributes;
    for (var i=0; i<attr.length; i++)
    {
      script.setAttribute(attr[i].name, attr[i].textContent);
    }
      
    script.innerHTML = refNode.innerHTML;  
    return script;
  }
}