module powerbi.extensibility.visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725  {
  
  const nonAcceptedNodes = [
    'META',
  ];

  let injectorCounter: number = 0;

  export function ResetInjector() : void {
    injectorCounter = 0;
  }

  export function injectorReady() : boolean {
    return injectorCounter == 0;
  }
  
  export function ParseElement(el: HTMLElement , target: HTMLElement) : Node[]
  {
    //  debugger;
    let arr: Node[] = [];
    let nodes = el.children;
    for (var i=0; i<nodes.length; i++)
    {
        
      if (nonAcceptedNodes.indexOf(nodes.item(i).nodeName)!=-1){
        continue;
      }

      let tempNode: HTMLElement; 
      if (nodes.item(i).nodeName.toLowerCase() == 'script'){
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
    let script = document.createElement('script');
    let attr = refNode.attributes;
    for (var i=0; i<attr.length; i++)
    {
      script.setAttribute(attr[i].name, attr[i].textContent);

      if (attr[i].name.toLowerCase() === 'src') {
        // waiting only for src to finish loading
        injectorCounter++;
        script.onload = function() {
            injectorCounter--;
        };
      }
    }

    script.innerHTML = refNode.innerHTML;  
    return script;
  }
}