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
        
        //first we convert the format to rgba
        if(this._from_format !== 'rgba'){
            let colors = this.anyToRgba(this._from_format, '#fff')
            console.log(colors)
        }
        return this._css

    }

    anyToRgba(format, color){
        let rgba;
        switch(format) {
            case 'hex':
                let rgb = this.hexToRgb(color);
                rgbArr.push(1); //aggiungo opacità piena
                rgba = [...rgbArr];
                break;
            case 'rgb' :
                let response = rgbValues(color);
                
                break;
            default: 
                console.log('anyToRgba method format error')
        }
        return rgba;
    }

    hexToRgb(hex){
        if(hex.slice(1).length === 3){
            hex = hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
        }
        return['0x'+h[0]+h[1]|0,'0x'+h[2]+h[3]|0,'0x'+h[4]+h[5]|0];
    }

    rgbValues(rgb){
        const regex = /^rgb\(\s*((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\s*\)$/;
        const match = rgb.match(regex);
        return {
            validate: match ? true : false,
            data: match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : rgb
        };
    }
}