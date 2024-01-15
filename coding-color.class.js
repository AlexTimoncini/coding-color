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
            let colorValues = this.colorValues(this._to_format, color.color);
            colorsValues[index].color = colorValues;
        })
        
        return colorsValues;
    }

    //Convert any format into RGBA w/validation
    colorValues(format, color){
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

        //case hex is in 3 digit
        if(validation && hex.slice(1).length === 3){
            hex = hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
        }
        let rgb = ['0x'+hex[0]+hex[1]|0,'0x'+hex[2]+hex[3]|0,'0x'+hex[4]+hex[5]|0]; 
        return { 
            response: validation ? true : false,
            data: validation ? rgb : hex
        }
    }

    //Convert rgb into an array of rgb values
    //Return the incorret rgb if validation is false
    rgbValues(rgb){
        const regex = /^rgb\(\s*((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\s*\)$/;
        const match = rgb.match(regex);
        return {
            response: match ? true : false,
            data: match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : rgb
        };
    }

    //get correct, hex, rgb or rgba colors value and string-position
    colorsFromCss(css){
        const regex = /(?<=:)\s*#(?:[0-9a-fA-F]{3}){1,2}(?=\s*;)|(?<=:)\s*rgb\(\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*\)(?=\s*;)|(?<=:)\s*rgba\(\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)(?=\s*;)/g;
        let matches;
        let colors = [];
        while ((matches = regex.exec(css)) !== null) {
            const match = matches[0];
            const matchStart = matches.index;
            const matchEnd = matchStart + match.length;
            colors.push({color: match.trim(), start: matchStart, end: matchEnd})
        }
        return colors
    }
}