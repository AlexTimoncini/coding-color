export class Calculator {
    //CONSTRUCT
    constructor(from_format, to_format, css, bg=null) {
        this._from_format = from_format;
        this._to_format = to_format;
        this._css = css;
        this._bg = bg;
    }
    // GETTER
    get from() {
        return this._from_format;
    }
    get to() {
        return this._to_format;
    }
    get css() {
        return this._css;
    }
    get bg() {
        return this._bg ?? false;
    }
    // METHOD
    calc() {
        /*Verifications:
            1- VALIDATE FORM --SCRIPT
            2- VALIDATE TO --SCRIPT
            3- VALIDATE CSS
                - Val RGB on rgbValues()
                - Val Hex on hexValidation()
            4- VALIDATE BG --SCRIPT
            5- FROM != TO
        */
        //FIRST COLOR EXTRACTION FROM CSS
        let colors = this.colorsFromCss(this._css);
        //SECOND CONVERTION ALL TO RGBA
        let colorsValues = [...colors];
        colors.forEach((color, index)=>{
            let colorValues = this.colorValues(color.color, color.format);
            colorsValues[index].color = colorValues.data;
        })
        
        return this.convertColors(colorsValues, this._from_format, this._to_format, this._bg);
    }

    //Convert any format into RGBA w/validation
    colorValues(color, format){
        let rgba = {
            converted: false,
            data: null
        };
        switch(format) {
            case 'hex':
                let hexToRgb = this.hexToRgb(color);
                if(hexToRgb.response){
                    rgba.converted = true;                    
                    rgba.data = [...hexToRgb.data];
                    rgba.data.push(1); //aggiungo opacità piena
                } else {
                    rgba.converted = false;                    
                    rgba.data = color;
                }
            break;

            case 'rgb' :
                let rgbToArr = this.rgbValues(color);
                if(rgbToArr.response){
                    rgba.converted = true;                    
                    rgba.data = [...rgbToArr.data];
                    rgba.data.push(1); //aggiungo opacità piena
                } else {
                    rgba.converted = false;                    
                    rgba.data = color;
                }
            break;

            case 'rgba' :
                let match = color.match(/\(([^)]*)\)/);
                let values = match ? match[1].split(',') : '';
                rgba.converted = (values && values.length === 4);
                rgba.data = rgba.converted ? values.map(v=>parseFloat(v)) : color;
            break;

            default: 
                console.log('anyToRgba method format error')
        }
        return rgba;
    }

    //Convert hex in 3 or 6 digit into an array of rgb values
    //Return the incorret hex if validation is false
    hexToRgb(hex){
        //validate hex
        const regex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
        const validation = regex.test(hex);
        
        hex = hex.replace('#', '');
        //case hex is in 3 digit
        if(validation && hex.length === 3){
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        let rgb = ['0x'+hex[0]+hex[1]|0,'0x'+hex[2]+hex[3]|0,'0x'+hex[4]+hex[5]|0];
        return { 
            response: validation,
            data: validation ? rgb : hex
        }
    }

    //Convert rgb into an array of rgb values
    //Return the incorret rgb if validation is false
    rgbValues(rgb){
        const regex = /\((.*?)\)/;
        const match = rgb.match(regex);
        return {
            response: !!match,
            data: match ? match[1].split(',').map(x=>parseInt(x)) : rgb
        };
    }

    //get correct, hex, rgb or rgba colors value and string-position
    colorsFromCss(css){
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
            colors.push({color: match.trim(), format: format, start: matchStart, end: matchEnd})
        }
        return colors
    }

    convertColors(colors, from, to, bg){
        let bgValues = this.colorValues(bg, 'hex')
        if(colors){
            colors.forEach((color, index)=>{
                if(from.includes(color.format)){
                    let alpha = 1 - color.color[3];
                    let red = Math.round((color.color[3] * (color.color[0] / 255) + (alpha * (bgValues.data[0] / 255))) * 255);
                    let green = Math.round((color.color[3] * (color.color[1] / 255) + (alpha * (bgValues.data[1] / 255))) * 255);
                    let blue = Math.round((color.color[3] * (color.color[2] / 255) + (alpha * (bgValues.data[2] / 255))) * 255);
                    switch(to){
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

        return  colors
    }
}