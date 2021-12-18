import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 0fr 1fr 2fr 1.5fr 0fr;
    grid-template-areas: 
    ". info1 game chat ."
    ". info2 game chat ."
    ". info3 game chat ."; 
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    padding: 10px;
    
    @media screen and (max-width: 1300px) {
    grid-template-columns: 1fr 1.5fr 1.5fr;
        grid-template-areas: 
        " info2 info1 chat"
        " game game chat "
        " game game chat"; 
    }
    @media screen and (max-width: 768px) {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridArea: string,
    alignSelf?: string,
    bgColor?: string,
    height?: string;
}

export const Box = styled.div<BoxProps>`
    width: 100%;
    height: ${(props: BoxProps) => props.height ? props.height : '100%'};
    background-color: #444;
    background-color: ${(props: BoxProps) => props.bgColor};
    border-radius: 5px;
    grid-area: ${(props: BoxProps) => props.gridArea};
    place-self: ${(props: BoxProps) => props.alignSelf};
    overflow: hidden;
`;
