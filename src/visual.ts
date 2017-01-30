/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {

    // Below is a snippet of a definition for an object which will contain the property values
    // selected by the users
    /*interface VisualSettings {
        lineColor: string;
    }*/

    // To allow this scenario you should first the following JSON definition to the capabilities.json file
    // under the "objects" property:
    // "settings": {
    //     "displayName": "Visual Settings",
    //     "description": "Visual Settings Tooltip",
    //     "properties": {
    //         "lineColor": {
    //         "displayName": "Line Color",
    //         "type": { "fill": { "solid": { "color": true }}}
    //         }
    //     }
    // }

    const renderVisualUpdateType: number[] = [4, 32, 36];

    export class Visual implements IVisual {
        //private iframeElement: HTMLIFrameElement;
        private rootElement: HTMLElement;
        private headNodes: Node[];
        private bodyNodes: Node[];
        private OptimizeROutput: boolean;

        // Snippet for defining the member property which will hold the property pane values
        /*private settings: VisualSettings;*/

        public constructor(options: VisualConstructorOptions) {
            this.rootElement = options.element;
            this.headNodes = [];
            this.bodyNodes = [];
            this.OptimizeROutput = false;
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.OptimizeROutput = getValue<boolean>(dataView.metadata.objects, 'OptimizeROutput', 'Enable', false);

            let payloadBase64: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                payloadBase64 = dataView.scriptResult.payloadBase64;
            }

            if (renderVisualUpdateType.indexOf(options.type) == -1) {
                if (payloadBase64) {
                    debugger
                    this.injectCodeFromPayload(payloadBase64);
                }
            }
            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {

        }

        private injectCodeFromPayload(payloadBase64: string): void {
            ResetInjector();

            var el = document.createElement('html');
            el.innerHTML = window.atob(payloadBase64);
            let head = el.getElementsByTagName('head')[0];
            let body = el.getElementsByTagName('body')[0];

            // update the header data only on the 1st update
            if (this.headNodes.length == 0) {
                this.headNodes = ParseElement(head, document.head);
            }

            while (this.bodyNodes.length > 0) {
                let tempNode = this.bodyNodes.pop();
                document.body.removeChild(tempNode);
            }
            this.bodyNodes = ParseElement(body, document.body);

            RunHTMLWidgetRenderer();
        }

        /**
         * This function gets called by the update function above. You should read the new values of the properties into 
         * your settings object so you can use the new value in the enumerateObjectInstances function below.
         * 
         * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
         * This object and property should be first defined in the capabilities.json file in the objects section.
         * In this code we get the property value from the objects (and have a default value in case the property is undefined)
         */
        public updateObjects(objects: DataViewObjects) {
            /*this.settings = <VisualSettings>{
                lineColor: getFillValue(object, 'settings', 'lineColor', "#333333")
            };*/
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         * Below is a code snippet for a case where you want to expose a single property called "lineColor" from the object called "settings"
         * This object and property should be first defined in the capabilities.json file in the objects section.
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'OptimizeROutput':
                debugger
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            Enable: this.OptimizeROutput && this.headNodes.length>0,
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }
    }
}
