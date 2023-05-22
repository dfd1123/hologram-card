import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { clamp, round } from '../utils/numberUtils';

interface PropsType {
    className?: string;
    pointerAction?: 'push' | 'pull';
}

const CardStyle = styled.div`
    transform: translate3d(0px, 0px, 0.01px);
    transform-style: preserve-3d;

  .card-translater{
    position: relative;
    transform: translate3d(var(--translateX), var(--translateY), 0.1px) scale(var(--scale));
    transform-origin: center;
    perspective: 600px;
    perspective-origin: center;
    will-change: transform;
    transition: all 2s;

        .card-rotator{
            position:relative;
            transform: rotateY(var(--rotateX)) rotateX(var(--rotateY));
            transform-style: preserve-3d;
            pointer-events: auto;
            transition: box-shadow 0.4s ease, opacity .33s ease-out;
            box-shadow: 0 0 3px -1px transparent, 0 0 2px 1px transparent, 0 0 5px 0px transparent, 0px 10px 20px -5px black, 0 2px 15px -5px black, 0 0 20px 0px transparent;
            transition: all 2s;

            .img-cont{
                width: 162px;
                img{
                    margin-left: -19px;
                    vertical-align: middle;
                }
            }
            .card_glare{
                position: absolute;
                top:0;
                left:0;
                bottom:0;
                right:0;
                z-index: 2;
                overflow: hidden;
                background-image: radial-gradient( farthest-corner circle at var(--pointer-x) var(--pointer-y), hsla(0, 0%, 100%, 0.8) 10%, hsla(0, 0%, 100%, 0.65) 20%, hsla(0, 0%, 0%, 0.5) 90% );
                opacity: var(--card-opacity);
                mix-blend-mode: overlay;
                transition: all 2s;
                will-change: transform, opacity;
            }
        }
    }

    &.interacting{
        .card-translator{
            transition: none;
        }
        .card-rotator{
            transition: none;
        }
        .card_glare{
            transition: none;
        }
    }
`

const Card = ({ className, pointerAction = 'push' }: PropsType) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const resetTimeoutId = useRef(-1);

    const [interacting, setInteracting] = useState(false);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 })

    const style = useMemo(() => `--rotateX: ${rotate.x}deg; --rotateY: ${rotate.y}deg; --translateX: 0; --translateY: 0; --pointer-x: ${glare.x}%; --pointer-y: ${glare.y}%; --card-opacity: ${glare.o}; --scale: 1;`, [rotate, glare]);

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

        updatingCardStyle({
            background: { x: 0, y: 0 },
            glare: {
                x: round(percent.x),
                y: round(percent.y),
                o: 1
            },
            rotate: {
                x: round(-(center.x / 3.5)),
                y: round(center.y / 2),
            }
        });

    }

    const updatingCardStyle = ({ background, rotate, glare }: { background: { x: number, y: number }, rotate: { x: number, y: number }, glare: { x: number, y: number, o: number } }) => {
        setRotate(pointerAction === 'push' ? { x: rotate.x * -1, y: rotate.y * -1 } : { ...rotate })
        setGlare(pointerAction === 'push' ? { x: 100 - glare.x, y: 100 - glare.y, o: glare.o } : { ...glare })
    }

    const resetStyle = () => {
        window.clearTimeout(resetTimeoutId.current);
        resetTimeoutId.current = window.setTimeout(() => {
            setInteracting(false)
            setRotate({ x: 0, y: 0 })
            setGlare({ x: 50, y: 50, o: 0 })

        }, 1000)
        // setRotate({x:0, y:0})
    }

    useEffect(() => {
        if (ref.current) ref.current.setAttribute('style', style);
    }, [style])


    return (
        <CardStyle className={`card ${className || ''} ${interacting ? 'interacting' : ''}`} onPointerMove={interact} onMouseOut={resetStyle} >
            <div ref={ref} className="card-translater">
                <div className="card-rotator">
                    <div className="img-cont">
                        <img src="/NFT-Image.png" alt="NFT-Card" />
                    </div>
                    <div className="card_glare"></div>
                </div>
            </div>
        </CardStyle>
    )
}

export default Card;