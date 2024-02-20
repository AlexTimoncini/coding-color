export class Calculator {
    constructor(from_format, to_format, css, opacity, background) {
        this._from_format = from_format
        this._to_format = to_format
        this._css = css
        this._opacity = opacity
        this._background = background || '#fff'
    }

    calc() {
        let colors = []
        this._css.forEach((line, index)=>{
            let newColors = this.colorsFromCss(line, index)
            newColors.forEach(col=>colors.push(col))
        })
        let colorsValues = [...colors]
        colors.forEach((color, index)=>{
            let colorValues = this.colorValues(color.color, color.format)
            colorsValues[index].color = colorValues.data
        })
        let parsedColors = this.convertColors(colorsValues)
        return this.convertCss(parsedColors)
    }

    //Convert any format into RGBA w/validation
    colorValues(color, format){
        let rgba = {
            converted: false,
            data: null
        };
        switch(format) {
            case 'hex':
                let hexToRgb = this.hexToRgb(color)
                if(hexToRgb.response){
                    rgba.converted = true
                    rgba.data = [...hexToRgb.data]
                    rgba.data.push(this._opacity)
                } else {
                    rgba.converted = false
                    rgba.data = color
                }
            break

            case 'rgb' :
                let rgbToArr = this.rgbValues(color)
                if(rgbToArr.response){
                    rgba.converted = true
                    rgba.data = [...rgbToArr.data]
                    rgba.data.push(this._opacity)
                } else {
                    rgba.converted = false
                    rgba.data = color
                }
            break

            case 'rgba' :
                let match = color.match(/\(([^)]*)\)/)
                let values = match ? match[1].split(',') : ''
                rgba.converted = (values && values.length === 4)
                rgba.data = rgba.converted ? values.map(v=>parseFloat(v)) : color
        }
        return rgba
    }

    //Convert hex in 3 or 6 digit into an array of rgb values
    //Return the incorret hex if validation is false
    hexToRgb(hex){
        //validate hex
        const regex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/
        const validation = regex.test(hex)
        
        hex = hex.replace('#', '')
        //case hex is in 3 digit
        if(validation && hex.length === 3){
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
        }
        let rgb = ['0x'+hex[0]+hex[1]|0,'0x'+hex[2]+hex[3]|0,'0x'+hex[4]+hex[5]|0]
        return { 
            response: validation,
            data: validation ? rgb : hex
        }
    }

    //Convert rgb into an array of rgb values
    //Return the incorret rgb if validation is false
    rgbValues(rgb){
        const regex = /\((.*?)\)/
        const match = rgb.match(regex)
        return {
            response: !!match,
            data: match ? match[1].split(',').map(x=>parseInt(x)) : rgb
        };
    }

    //get correct, hex, rgb or rgba colors value and string-position
    colorsFromCss(css, lineNumber){
        const regex = /\s*#(?:[0-9a-fA-F]{3}){1,2}\s*|\s*rgb\(\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*\)\s*|\s*rgba\(\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)\s*/gm;
        let matches;
        let colors = [];
        while ((matches = regex.exec(css)) !== null) {
            const match = matches[0];
            const matchStart = matches.index;
            const matchEnd = matchStart + match.length;
            let format;
            if (match.trim().includes('#')){
                format = 'hex';
            } else if (match.trim().includes('rgba')){
                format = 'rgba';
            } else {
                format = 'rgb';
            }
            colors.push({color: match.trim(), format: format, start: matchStart, end: matchEnd, line: lineNumber})
        }
        return colors
    }

    convertColors(colors){
        let bgValues = this.colorValues(this._background, 'hex') //estraiamo i valori dello sfondo (default #fff)
        if(colors){
            colors.forEach((color)=>{
                if(this._from_format.includes(color.format)){
                    let alpha = 1 - color.color[3];
                    let red = Math.round((color.color[3] * (color.color[0] / 255) + (alpha * (bgValues.data[0] / 255))) * 255);
                    let green = Math.round((color.color[3] * (color.color[1] / 255) + (alpha * (bgValues.data[1] / 255))) * 255);
                    let blue = Math.round((color.color[3] * (color.color[2] / 255) + (alpha * (bgValues.data[2] / 255))) * 255);
                    switch(this._to_format){
                        case 'rgba':
                            color.color = 'rgba('+ color.color[0] +',' + color.color[1] + ','  + color.color[2] + ','  + color.color[3] + ')';
                            color.converted = true
                        break;
                        case 'rgb':
                            color.color = 'rgb('+red+','+green+','+blue+')';
                            color.converted = true
                        break;
                        case 'hex':
                            color.color = '#'+red.toString(16)+green.toString(16)+blue.toString(16)
                            color.converted = true
                        break;
                    }
                } else {
                    color.converted = false
                }
            });
        }
        console.log('final', colors)
        return  colors
    }

    convertCss(colorsData){
        console.log(colorsData)
        let css = this._css,
            colorsToConvert = colorsData.filter(c=>c.converted),
            shift = 0

        colorsToConvert.forEach((col)=>{
            let newLine = this.replaceColor(css[col.line], col.start, col.end, col.color)
            css[col.line] = newLine

        })
        return css
        //editor.getDoc().setValue(newCss);
    }

    replaceColor(originalString, start, end, replacement) {
        let htmlReplacement = ' <span class="marked" title="'+replacement+'">'+replacement+'</span>'
        let positionShift = htmlReplacement.length - (end - start)
        let prefix = originalString.substring(0, start)
        let suffix = originalString.substring(end)
        return {
            cssConverted: prefix + htmlReplacement + suffix,
            shift: positionShift
        }
    }

}