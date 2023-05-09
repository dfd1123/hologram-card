export interface CardEffectStyle {
    translateX: number;
    translateY: number;
    rotateX: number;
    rotateY: number;
    scale: number;

}

export default class CardEffect {
    private styles: CardEffectStyle;

    constructor(){
        this.styles = {
            translateX: 0,
            translateY: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1
        }
    }

    interact(e: Event) {
        console.log(e);
    }
}