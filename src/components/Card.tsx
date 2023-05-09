import React, { PointerEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { clamp, round } from '../utils/numberUtils';

interface PropsType {
    className?: string;
}

interface CardEffectStyle {
    translateX: number;
    translateY: number;
    rotateX: number;
    rotateY: number;
    scale: number;

}

const Card = ({className}:PropsType) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const resetTimeoutId = useRef(-1);
    const waitReseting = useRef(false);

    const [interacting, setInteracting] = useState(false);
    const [rotate, setRotate] = useState({x: 0, y: 0});
    const [glare, setGlare] = useState({x:0, y:0, o:0})

    const style = useMemo(() => `--rotateX: ${rotate.x}deg; --rotateY: ${rotate.y}deg; --translateX: 0; --translateY: 0; --pointer-x: ${glare.x}%; --pointer-y: ${glare.y}%; --card-opacity: ${glare.o}; --scale: 1;`,[rotate, glare])

    const interact = (e: any) => {
        // console.log(e.type, e);

        setInteracting(true);

        const $el = e.target;
        const rect = $el.getBoundingClientRect(); 
        const absolute = {
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top,
          };
          const percent = {
            x: clamp(round((100 / rect.width) * absolute.x)),
            y: clamp(round((100 / rect.height) * absolute.y)),
          };
          const center = {
            x: percent.x - 50,
            y: percent.y - 50,
          };

          console.log(absolute, percent, center);

          updatingCardStyle({background: {x: 0, y: 0}, 
            glare: {
                x: round(percent.x),
                y: round(percent.y),
                o: 1
            }, 
          rotate: {
                x: round(-(center.x / 3.5)),
                y: round(center.y / 2),
          }});

    }

    const updatingCardStyle = ({background, rotate, glare}: {background: {x: number, y: number}, rotate: {x: number, y: number}, glare: {x: number, y: number, o: number}}) => {
        setRotate({...rotate})
        setGlare({...glare})
    }

    const resetStyle = () => {
        window.clearTimeout(resetTimeoutId.current);
        resetTimeoutId.current = window.setTimeout(() => {
            setInteracting(false)
            setRotate({x:0, y:0})
            setGlare({x:0, y:0, o:0})

        }, 200)
        // setRotate({x:0, y:0})
    }

    useEffect(() => {
        if(ref.current) ref.current.setAttribute('style', style);
    }, [style])


    return (
        <div ref={ref} className={`card ${className || ''} ${interacting ? 'interacting' : ''}`} onPointerMove={interact} onMouseOut={resetStyle} >
            <div className="img-cont">
            <img src="/NFT-Image.png" alt="NFT-Card" />
            </div>
            <div className="card_glare"></div>
        </div>
    )
} 

export default Card;