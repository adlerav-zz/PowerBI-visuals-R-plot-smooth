var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_E67F6187_8266_4C40_822B_369EDD127725;
            (function (PBI_CV_E67F6187_8266_4C40_822B_369EDD127725) {
                var nonAcceptedNodes = [
                    'META',
                ];
                function ParseElement(el, target) {
                    var arr;
                    var nodes = el.children;
                    for (var i = 0; i < nodes.length; i++) {
                        if (nonAcceptedNodes.indexOf(nodes.item(i).nodeName) != -1) {
                            continue;
                        }
                        console.log(nodes[i].nodeName);
                        nodes.item(i).cloneNode(true);
                        var tempNode = void 0;
                        if (nodes.item(i).nodeName == 'SCRIPT') {
                            tempNode = createScriptNode(nodes.item(i));
                        }
                        else {
                            tempNode = nodes.item(i).cloneNode(true);
                        }
                        target.appendChild(tempNode);
                        arr.push(tempNode);
                    }
                    return arr;
                }
                function createScriptNode(refNode) {
                    var script = document.createElement('script');
                    var attr = refNode.attributes;
                    for (var i = 0; i < attr.length; i++) {
                        script.setAttribute(attr[i].name, attr[i].textContent);
                    }
                    script.innerHTML = refNode.innerHTML;
                    return script;
                }
            })(PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 || (visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_E67F6187_8266_4C40_822B_369EDD127725;
            (function (PBI_CV_E67F6187_8266_4C40_822B_369EDD127725) {
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_E67F6187_8266_4C40_822B_369EDD127725.getValue = getValue;
                function getFillValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var fill = object[propertyName];
                            if (fill !== undefined && fill.solid !== undefined && fill.solid.color !== undefined) {
                                return fill.solid.color;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_E67F6187_8266_4C40_822B_369EDD127725.getFillValue = getFillValue;
            })(PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 || (visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_E67F6187_8266_4C40_822B_369EDD127725;
            (function (PBI_CV_E67F6187_8266_4C40_822B_369EDD127725) {
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
                var Visual = (function () {
                    // Snippet for defining the member property which will hold the property pane values
                    /*private settings: VisualSettings;*/
                    function Visual(options) {
                        this.iframeElement = document.createElement('iframe');
                        this.iframeElement.setAttribute("sandbox", "allow-scripts");
                        options.element.appendChild(this.iframeElement);
                    }
                    Visual.prototype.update = function (options) {
                        var dataViews = options.dataViews;
                        if (!dataViews || dataViews.length === 0)
                            return;
                        var dataView = dataViews[0];
                        if (!dataView || !dataView.metadata)
                            return;
                        this.updateObjects(dataView.metadata.objects);
                        var payload = null;
                        if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                            var payloadBase64 = dataView.scriptResult.payloadBase64;
                            payload = window.atob(payloadBase64);
                        }
                        if (payload) {
                            this.iframeElement.setAttribute("srcdoc", payload);
                        }
                        else {
                            this.iframeElement.setAttribute("srcdoc", "<p>Not really updating... and where is my payload???</p>");
                        }
                        this.onResizing(options.viewport);
                    };
                    Visual.prototype.onResizing = function (finalViewport) {
                        this.iframeElement.style.height = finalViewport.height + 'px';
                        this.iframeElement.style.width = finalViewport.width + 'px';
                    };
                    /**
                     * This function gets called by the update function above. You should read the new values of the properties into
                     * your settings object so you can use the new value in the enumerateObjectInstances function below.
                     *
                     * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
                     * This object and property should be first defined in the capabilities.json file in the objects section.
                     * In this code we get the property value from the objects (and have a default value in case the property is undefined)
                     */
                    Visual.prototype.updateObjects = function (objects) {
                        /*this.settings = <VisualSettings>{
                            lineColor: getFillValue(object, 'settings', 'lineColor', "#333333")
                        };*/
                    };
                    /**
                     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     *
                     * Below is a code snippet for a case where you want to expose a single property called "lineColor" from the object called "settings"
                     * This object and property should be first defined in the capabilities.json file in the objects section.
                     */
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        /*switch( objectName ){
                            case 'settings':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        lineColor: this.settings.lineColor,
                                     },
                                    selector: null
                                });
                                break;
                        };*/
                        return objectEnumeration;
                    };
                    return Visual;
                }());
                PBI_CV_E67F6187_8266_4C40_822B_369EDD127725.Visual = Visual;
            })(PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 || (visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725 = {
                name: 'PBI_CV_E67F6187_8266_4C40_822B_369EDD127725',
                displayName: 'RPlotSmooth',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.4.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_E67F6187_8266_4C40_822B_369EDD127725.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map