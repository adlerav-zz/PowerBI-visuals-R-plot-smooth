module powerbi.extensibility.visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725  {
    const nonAcceptedNodes = [
        'META',
    ];

  function ParseElement(el: HTMLElement , target: HTMLElement) : Node[]
  {
    let arr: Node[];
    let nodes = el.children;
    for (var i=0; i<nodes.length; i++)
    {
        
      if (nonAcceptedNodes.indexOf(nodes.item(i).nodeName)!=-1){
        continue;
      }
      console.log(nodes[i].nodeName);


nodes.item(i).cloneNode(true);

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
  
    /*
    export function getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T ): T {
        if(objects) {
            let object = objects[objectName];
            if(object) {
                let property: T = <T>object[propertyName];
                if(property !== undefined) {
                    return property;
                }
            }
        }
        return defaultValue;
    }

    export function getFillValue(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: string ): string {
        if(objects) {
            let object = objects[objectName];
            if(object) {
                let fill: Fill = <Fill>object[propertyName];
                if(fill !== undefined && fill.solid !== undefined && fill.solid.color !== undefined) {
                    return fill.solid.color;
                }
            }
        }
        return defaultValue;
    }
    */
}