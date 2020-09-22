import React, {
    PureComponent,
    useState
} from 'react';
import * as _ from 'lodash';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';
import {saveSvgAsPng} from 'save-svg-as-png';

class ExportSvgButton extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }
    }

    svgToString(svgNode, width, height) {

            var getCSSStyles = function( parentElement ) {

                var contains = function(str, subStr) {
                    return str.indexOf( subStr ) === -1 ? false : true;
                };

                var containsArray = function(str, arr){
                    if(!str){ return false; }
                    return (_.find(arr, function(subStr){ return contains(str, subStr); })) ? true : false;
                };

                var selectorTextArr = [];

                // Add Parent element Id and Classes to the list
                selectorTextArr.push( '#'+parentElement.id );
                for (var c = 0; c < parentElement.classList.length; c++) {
                    if (!contains('.' + parentElement.classList[c], selectorTextArr)) {
                        selectorTextArr.push('.' + parentElement.classList[c]);
                    }
                }

                // Add Children element Ids and Classes to the list
                var nodes = parentElement.getElementsByTagName('*');
                for (var i = 0; i < nodes.length; i++) {
                    var id = nodes[i].id;
                    if ( !contains('#'+id, selectorTextArr) ){
                        selectorTextArr.push( '#'+id );
                    }

                    var classes = nodes[i].classList;
                    for (var cl = 0; cl < classes.length; cl++) {
                        if (!contains('.' + classes[cl], selectorTextArr)) {
                            selectorTextArr.push('.' + classes[cl]);
                        }
                    }
                }

                // Extract CSS Rules
                var extractedCSSText = '';
                for (var k = 0; k < document.styleSheets.length; k++) {
                    var cssRules = document.styleSheets[k].cssRules;
                    for (var r = 0; r < cssRules.length; r++) {
                        if ( containsArray( cssRules[r].selectorText, selectorTextArr ) ){
                            extractedCSSText += cssRules[r].cssText;
                        }

                    }
                }

                return extractedCSSText;

            };

            var appendCSS = function( cssText, element ) {
                var styleElement = document.createElement('style');
                styleElement.setAttribute('type','text/css');
                styleElement.innerHTML = cssText;
                var refNode = element.hasChildNodes() ? element.children[0] : null;
                element.insertBefore( styleElement, refNode );
            };


            svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            var cssStyleText = getCSSStyles( svgNode );

            console.log(cssStyleText)

            appendCSS( cssStyleText, svgNode );

            var serializer = new XMLSerializer();
            var svgString = serializer.serializeToString(svgNode);
            svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
            svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

            // adapt the size
            //svgString = svgString.replace(/width="[%|\d]+"/, 'width="' + width + '"'); // the width
            //svgString = svgString.replace(/height="[%|\d]+"/, 'height="' + height + '"'); // the height

            return svgString;
    }

    exportSVG(){
        const {svg} = this.props

        const fileName = "dummy"
        const svgString = this.svgToString(svg.current, 1000, 1000)
        const blob = new Blob([ svgString ], {type: 'image/svg+xml;charset=utf-8'});
        saveAs(blob, fileName + '.svg');
    }

    toggleDropdown = () => {
        const {isOpen} = this.state
        this.setState({isOpen: !isOpen})
    }

    exportPNG(){
        const {svg} = this.props

        const imageOptions = {
            scale: 5,
            encoderOptions: 1
        }

        saveSvgAsPng(svg.current, "diagram.png", imageOptions)
    }

    render() {
        const {isOpen} = this.state

        return <ButtonDropdown size="sm" isOpen={isOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret>
                Export
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={() => this.exportPNG()}>PNG</DropdownItem>
                <DropdownItem onClick={() => this.exportSVG()}>SVG</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    }
}

ExportSvgButton.propTypes = {
    svg: PropTypes.object.isRequired
};

export default ExportSvgButton